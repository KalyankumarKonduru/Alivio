import axios from 'axios';
import {
  CREATE_ORDER,
  GET_ORDERS,
  GET_ORDER,
  ORDER_ERROR,
  SET_LOADING
} from '../constants/actionTypes';
import { setAlert } from './alertActions';
import { clearCart } from './cartActions';

// Create new order
export const createOrder = (orderData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/payments/process', orderData, config);

    dispatch({
      type: CREATE_ORDER,
      payload: res.data.data
    });

    dispatch(clearCart());
    dispatch(setAlert('Order placed successfully', 'success'));
    return res.data.data;
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: err.response.data.message
    });
    
    dispatch(setAlert('Failed to place order', 'error'));
    throw err;
  }
};

// Get user orders
export const getUserOrders = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get('/api/payments/user');

    dispatch({
      type: GET_ORDERS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get order by ID
export const getOrderById = id => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get(`/api/payments/${id}`);

    dispatch({
      type: GET_ORDER,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get organizer orders
export const getOrganizerOrders = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get('/api/payments/organizer');

    dispatch({
      type: GET_ORDERS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: ORDER_ERROR,
      payload: err.response.data.message
    });
  }
};
