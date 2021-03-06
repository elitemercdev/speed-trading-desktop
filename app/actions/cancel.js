import {
  PLACE_CANCEL_REQUEST,
  PLACE_CANCEL_REQUEST_SUCCESS
} from "../constants/cancel";

import { ipcRenderer } from "electron";

const cancel_order_success = () => ({ type: PLACE_CANCEL_REQUEST_SUCCESS });
export const place_cancel_order = ({ cancel_order }) => async (
  dispatch,
  state,
  ipc = ipcRenderer
) => {
  await ipc.send(PLACE_CANCEL_REQUEST, cancel_order);

  ipc.once(PLACE_CANCEL_REQUEST_SUCCESS, async (event, data) => {
    dispatch(cancel_order_success(data));
  });
};
