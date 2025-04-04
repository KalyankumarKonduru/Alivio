import axios from 'axios';
import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_ERROR,
  SET_LOADING
} from '../constants/actionTypes';
import { setAlert } from './alertActions';

// Get user cart
export const getCart = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    // If not authenticated, get cart from localStorage
    if (!localStorage.token) {
      const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      
      return dispatch({
        type: ADD_TO_CART,
        payload: { items: cartItems }
      });
    }
    
    // Otherwise, get cart from API
    const res = await axios.get('/api/cart');
    
    dispatch({
      type: ADD_TO_CART,
      payload: res.data.data
    });
  } catch (err) {
    console.error('Error fetching cart:', err);
    
    // Fallback to localStorage if API fails
    const cartItems = localStorage.getItem('cartItems')
      ? JSON.parse(localStorage.getItem('cartItems'))
      : [];
    
    dispatch({
      type: ADD_TO_CART,
      payload: { items: cartItems }
    });
    
    dispatch({
      type: CART_ERROR,
      payload: 'Error fetching cart'
    });
  }
};

// Add item to cart
export const addToCart = (ticket, event, quantity, price) => async dispatch => {
  try {
    const cartItem = {
      ticket: ticket._id,
      event: event._id,
      eventTitle: event.title,
      ticketType: ticket.type,
      quantity,
      price,
      subtotal: price * quantity,
      date: event.date,
      venue: event.venue.name
    };

    // If authenticated, add to API
    if (localStorage.token) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };

      const body = {
        ticket: ticket._id,
        event: event._id,
        quantity,
        price
      };

      await axios.post('/api/cart', body, config);
      
      // Get updated cart from API
      dispatch(getCart());
    } else {
      // Otherwise, use localStorage
      // Check if item already exists in cart
      const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      
      const existItem = cartItems.find(x => x.ticket === cartItem.ticket);
      
      let updatedCart;
      if (existItem) {
        // Update existing item
        updatedCart = cartItems.map(item => 
          item.ticket === existItem.ticket ? cartItem : item
        );
      } else {
        // Add new item
        updatedCart = [...cartItems, cartItem];
      }
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      dispatch({
        type: ADD_TO_CART,
        payload: { items: updatedCart }
      });
    }

    dispatch(setAlert('Added to cart', 'success'));
  } catch (err) {
    console.error('Error adding to cart:', err);
    dispatch({
      type: CART_ERROR,
      payload: 'Error adding to cart'
    });
    
    dispatch(setAlert('Failed to add to cart', 'error'));
  }
};

// Remove item from cart
export const removeFromCart = ticketId => async dispatch => {
  try {
    // If authenticated, remove from API
    if (localStorage.token) {
      await axios.delete(`/api/cart/${ticketId}`);
      
      // Get updated cart from API
      dispatch(getCart());
    } else {
      // Otherwise, use localStorage
      const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      
      const updatedCart = cartItems.filter(item => item.ticket !== ticketId);
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      dispatch({
        type: REMOVE_FROM_CART,
        payload: ticketId
      });
    }

    dispatch(setAlert('Removed from cart', 'success'));
  } catch (err) {
    console.error('Error removing from cart:', err);
    dispatch({
      type: CART_ERROR,
      payload: 'Error removing from cart'
    });
    
    dispatch(setAlert('Failed to remove from cart', 'error'));
  }
};

// Update cart item quantity
export const updateCartQuantity = (ticketId, quantity) => async dispatch => {
  try {
    // If authenticated, update in API
    if (localStorage.token) {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      
      await axios.put(`/api/cart/${ticketId}`, { quantity }, config);
      
      // Get updated cart from API
      dispatch(getCart());
    } else {
      // Otherwise, use localStorage
      const cartItems = localStorage.getItem('cartItems')
        ? JSON.parse(localStorage.getItem('cartItems'))
        : [];
      
      const updatedCart = cartItems.map(item => {
        if (item.ticket === ticketId) {
          return {
            ...item,
            quantity,
            subtotal: item.price * quantity
          };
        }
        return item;
      });
      
      localStorage.setItem('cartItems', JSON.stringify(updatedCart));
      
      dispatch({
        type: UPDATE_CART_QUANTITY,
        payload: { ticketId, quantity }
      });
    }

    dispatch(setAlert('Cart updated', 'success'));
  } catch (err) {
    console.error('Error updating cart:', err);
    dispatch({
      type: CART_ERROR,
      payload: 'Error updating cart'
    });
    
    dispatch(setAlert('Failed to update cart', 'error'));
  }
};

// Clear cart
export const clearCart = () => async dispatch => {
  try {
    // If authenticated, clear in API
    if (localStorage.token) {
      await axios.delete('/api/cart');
    }
    
    // Always clear localStorage
    localStorage.removeItem('cartItems');
    
    dispatch({
      type: CLEAR_CART
    });
  } catch (err) {
    console.error('Error clearing cart:', err);
    dispatch({
      type: CART_ERROR,
      payload: 'Error clearing cart'
    });
  }
};