import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_ERROR
} from '../constants/actionTypes';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  loading: false,
  error: null
};

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case ADD_TO_CART:
      const item = payload;
      const existItem = state.cartItems.find(
        x => x.ticket === item.ticket
      );

      if (existItem) {
        const updatedCartItems = state.cartItems.map(x =>
          x.ticket === existItem.ticket ? item : x
        );
        localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
        
        return {
          ...state,
          cartItems: updatedCartItems
        };
      } else {
        const newCartItems = [...state.cartItems, item];
        localStorage.setItem('cartItems', JSON.stringify(newCartItems));
        
        return {
          ...state,
          cartItems: newCartItems
        };
      }
    case REMOVE_FROM_CART:
      const updatedCartItems = state.cartItems.filter(
        x => x.ticket !== payload
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedCartItems));
      
      return {
        ...state,
        cartItems: updatedCartItems
      };
    case UPDATE_CART_QUANTITY:
      const { ticketId, quantity } = payload;
      const updatedItems = state.cartItems.map(item =>
        item.ticket === ticketId
          ? { ...item, quantity, subtotal: item.price * quantity }
          : item
      );
      localStorage.setItem('cartItems', JSON.stringify(updatedItems));
      
      return {
        ...state,
        cartItems: updatedItems
      };
    case CLEAR_CART:
      localStorage.removeItem('cartItems');
      
      return {
        ...state,
        cartItems: []
      };
    case CART_ERROR:
      return {
        ...state,
        error: payload
      };
    default:
      return state;
  }
};

export default cartReducer;
