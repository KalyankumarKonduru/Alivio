import { combineReducers } from 'redux';
import authReducer from './authReducer';
import eventReducer from './eventReducer';
import ticketReducer from './ticketReducer';
import cartReducer from './cartReducer';
import orderReducer from './orderReducer';
import alertReducer from './alertReducer';

export default combineReducers({
  auth: authReducer,
  events: eventReducer,
  tickets: ticketReducer,
  cart: cartReducer,
  orders: orderReducer,
  alerts: alertReducer
});
