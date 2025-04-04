import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_ERROR,
  SET_LOADING
} from '../constants/actionTypes';

const initialState = {
  cartItems: localStorage.getItem('cartItems')
    ? JSON.parse(localStorage.getItem('cartItems'))
    : [],
  loading: false,
  error: null
};

// Ensure we have valid cart items in localStorage
try {
  if (localStorage.getItem('cartItems')) {
    JSON.parse(localStorage.getItem('cartItems'));
  }
} catch (e) {
  // If there's an error parsing, reset the cart
  localStorage.setItem('cartItems', JSON.stringify([]));
}

const cartReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case ADD_TO_CART:
      // If payload is a cart object from API
      if (payload.items) {
        return {
          ...state,
          cartItems: payload.items,
          loading: false
        };
      }
      
      // If payload is a single item (legacy behavior)
      const item = payload;
      const existItem = state.cartItems.find(
        x => x.ticket === item.ticket
      );

      if (existItem) {
        const updatedCartItems = state.cartItems.map(x =>
          x.ticket === existItem.ticket ? item : x
        );
        
        return {
          ...state,
          cartItems: updatedCartItems,
          loading: false
        };
      } else {
        return {
          ...state,
          cartItems: [...state.cartItems, item],
          loading: false
        };
      }
    case REMOVE_FROM_CART:
      return {
        ...state,
        cartItems: state.cartItems.filter(x => x.ticket !== payload),
        loading: false
      };
    case UPDATE_CART_QUANTITY:
      const { ticketId, quantity } = payload;
      return {
        ...state,
        cartItems: state.cartItems.map(item =>
          item.ticket === ticketId
            ? { ...item, quantity, subtotal: item.price * quantity }
            : item
        ),
        loading: false
      };
    case CLEAR_CART:
      return {
        ...state,
        cartItems: [],
        loading: false
      };
    case CART_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default cartReducer;
