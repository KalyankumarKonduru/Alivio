import {
  ADD_TO_CART,
  REMOVE_FROM_CART,
  UPDATE_CART_QUANTITY,
  CLEAR_CART,
  CART_ERROR
} from '../constants/actionTypes';
import { setAlert } from './alertActions';

// Add item to cart
export const addToCart = (ticket, event, quantity, price) => dispatch => {
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

    dispatch({
      type: ADD_TO_CART,
      payload: cartItem
    });

    dispatch(setAlert('Added to cart', 'success'));
  } catch (err) {
    dispatch({
      type: CART_ERROR,
      payload: 'Error adding to cart'
    });
    
    dispatch(setAlert('Failed to add to cart', 'error'));
  }
};

// Remove item from cart
export const removeFromCart = ticketId => dispatch => {
  try {
    dispatch({
      type: REMOVE_FROM_CART,
      payload: ticketId
    });

    dispatch(setAlert('Removed from cart', 'success'));
  } catch (err) {
    dispatch({
      type: CART_ERROR,
      payload: 'Error removing from cart'
    });
    
    dispatch(setAlert('Failed to remove from cart', 'error'));
  }
};

// Update cart item quantity
export const updateCartQuantity = (ticketId, quantity) => dispatch => {
  try {
    dispatch({
      type: UPDATE_CART_QUANTITY,
      payload: { ticketId, quantity }
    });

    dispatch(setAlert('Cart updated', 'success'));
  } catch (err) {
    dispatch({
      type: CART_ERROR,
      payload: 'Error updating cart'
    });
    
    dispatch(setAlert('Failed to update cart', 'error'));
  }
};

// Clear cart
export const clearCart = () => dispatch => {
  try {
    dispatch({
      type: CLEAR_CART
    });
  } catch (err) {
    dispatch({
      type: CART_ERROR,
      payload: 'Error clearing cart'
    });
  }
};
