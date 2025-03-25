import axios from 'axios';
import {
  GET_TICKETS,
  GET_TICKET,
  TICKET_ERROR,
  CREATE_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET,
  SET_LOADING
} from '../constants/actionTypes';
import { setAlert } from './alertActions';

// Get tickets by event
export const getTicketsByEvent = eventId => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get(`/api/tickets/event/${eventId}`);

    dispatch({
      type: GET_TICKETS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get ticket by ID
export const getTicketById = id => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get(`/api/tickets/${id}`);

    dispatch({
      type: GET_TICKET,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
  }
};

// Create new ticket
export const createTicket = formData => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.post('/api/tickets', formData, config);

    dispatch({
      type: CREATE_TICKET,
      payload: res.data.data
    });

    dispatch(setAlert('Ticket Created Successfully', 'success'));
    return res.data.data;
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
    
    dispatch(setAlert('Failed to create ticket', 'error'));
    throw err;
  }
};

// Update ticket
export const updateTicket = (id, formData) => async dispatch => {
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };

  try {
    const res = await axios.put(`/api/tickets/${id}`, formData, config);

    dispatch({
      type: UPDATE_TICKET,
      payload: res.data.data
    });

    dispatch(setAlert('Ticket Updated Successfully', 'success'));
    return res.data.data;
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
    
    dispatch(setAlert('Failed to update ticket', 'error'));
    throw err;
  }
};

// Delete ticket
export const deleteTicket = id => async dispatch => {
  try {
    await axios.delete(`/api/tickets/${id}`);

    dispatch({
      type: DELETE_TICKET,
      payload: id
    });

    dispatch(setAlert('Ticket Deleted Successfully', 'success'));
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
    
    dispatch(setAlert('Failed to delete ticket', 'error'));
  }
};

// Get tickets purchased by user
export const getUserTickets = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  
  try {
    const res = await axios.get('/api/tickets/user');

    dispatch({
      type: GET_TICKETS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: TICKET_ERROR,
      payload: err.response.data.message
    });
  }
};
