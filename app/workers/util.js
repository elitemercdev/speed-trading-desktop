import { logger } from "../logger";
import promiseRetry from "promise-retry";

const promisfy = (origFn, key) => (...callArgs) => {
  return promiseRetry({ retries: 5 }, (retry, number) => {
    if (number > 1)
      logger.error(`reattempting ${key} ${JSON.stringify(callArgs)}`);

    return new Promise((resolve, reject) => {
      origFn.apply(null, [
        ...callArgs,
        (error, response, body) => {
          return error || !body || response.statusCode > 399
            ? reject(error || { message: body.detail })
            : resolve(body);
        }
      ]);
    }).catch(err => {
      if (err.code === "ETIMEDOUT" || err.code === "ENOTFOUND") {
        retry(err);
      }

      throw err;
    });
  });
};

export default ({ username, password }) => {
  return new Promise(resolve => {
    const Robinhood = require("robinhood")(
      {
        username,
        password
      },
      () => {
        Object.keys(Robinhood).forEach(key => {
          const origFn = Robinhood[key];
          Robinhood[key] = promisfy(origFn, key);
        });
        resolve(Robinhood);
      }
    );
  });
};

export const timeout = ms => new Promise(resolve => setTimeout(resolve, ms));
