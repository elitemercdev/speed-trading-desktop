const init = require("./util");
const placeBuyOrder = require("./place-buy-order");
const placeSellOrder = require("./place-sell-order");
const placeStopLossOrder = require("./place-stop-loss-order");
const chunk = require("./chunk");
const mapLimit = require("promise-map-limit");

let Robinhood;

export const login = async credentials => {
  Robinhood = await init(credentials);
  return { loggedin: true };
};

export const place_cancel_order = async order => {
  const placedOrder = await Robinhood.cancel_order(order);
  return placedOrder;
};

export const place_stop_loss_order = async order => {
  const placedOrder = await placeStopLossOrder(Robinhood, order);
  return placedOrder;
};

export const place_buy_order = async order => {
  const placedOrder = await placeBuyOrder(Robinhood, order);
  return placedOrder;
};

export const place_sell_order = async order => {
  const placedOrder = await placeSellOrder(Robinhood, order);
  return placedOrder;
};

export const update_price = (callback, symbol) => async () => {
  let price = await Robinhood.quote_data(symbol);
  callback({
    price: price.results[0].last_trade_price,
    instrument: price.results[0].instrument,
    symbol: price.results[0].symbol
  });
};

export const update_positions = callback => async () => {
  const resl = await Robinhood.nonzero_positions();
  let arr = await mapLimit(resl.results, 1, async order => {
    let ticker = await Robinhood.url(order.instrument);

    return { symbol: ticker.symbol, ...order };
  });

  callback(arr);
};

export const update_orders = callback => async () => {
  let options = { updated_at: getDate() };
  let orders = await Robinhood.orders(options);
  let tickers = await chunk(orders.results, Robinhood.url);
  callback(tickers);
};

function getDate() {
  var today = new Date();
  var dd = today.getDate();
  var mm = today.getMonth() + 1; //January is 0!

  var yyyy = today.getFullYear();
  if (dd < 10) {
    dd = "0" + dd;
  }
  if (mm < 10) {
    mm = "0" + mm;
  }
  var today = yyyy + "-" + mm + "-" + dd;
  return today;
}
