import { combineReducers } from "redux";
import authentication from "./authentication";
import messages from "./messages";
import buy_order from "./buy_order";
import sell_orders from "./sell_orders";
import login from "./login";

export default combineReducers({
  authentication,
  messages,
  buy_order,
  sell_orders,
  login
});
