import {
  CREATE_ORDER,
  GET_ORDERS,
  GET_ORDER,
  ORDER_ERROR
} from '../constants/actionTypes';

const initialState = {
  orders: [],
  order: null,
  loading: true,
  error: null
};

const orderReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_ORDERS:
      return {
        ...state,
        orders: payload,
        loading: false
      };
    case GET_ORDER:
      return {
        ...state,
        order: payload,
        loading: false
      };
    case CREATE_ORDER:
      return {
        ...state,
        orders: [payload, ...state.orders],
        order: payload,
        loading: false
      };
    case ORDER_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default orderReducer;
