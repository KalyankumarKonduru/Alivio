import axios from 'axios';
import {
  GET_EVENTS,
  GET_EVENT,
  EVENT_ERROR,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SEARCH_EVENTS,
  FILTER_EVENTS,
  SET_LOADING,
  GET_EVENT_ATTENDEES,
  GET_ORGANIZER_STATS,
  GET_EVENT_ANALYTICS
} from '../constants/actionTypes';
import { setAlert } from './alertActions';

// Get all events
export const getEvents = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get('/api/events');
    dispatch({
      type: GET_EVENTS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get event by ID
export const getEventById = id => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get(`/api/events/${id}`);
    dispatch({
      type: GET_EVENT,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Create new event
export const createEvent = formData => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  try {
    const res = await axios.post('/api/events', formData, config);
    dispatch({
      type: CREATE_EVENT,
      payload: res.data.data
    });
    dispatch(setAlert('Event Created Successfully', 'success'));
    return res.data.data;
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
    dispatch(setAlert('Failed to create event', 'error'));
    throw err;
  }
};

// Update event
export const updateEvent = (id, formData) => async dispatch => {
  const config = { headers: { 'Content-Type': 'application/json' } };
  try {
    const res = await axios.put(`/api/events/${id}`, formData, config);
    dispatch({
      type: UPDATE_EVENT,
      payload: res.data.data
    });
    dispatch(setAlert('Event Updated Successfully', 'success'));
    return res.data.data;
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
    dispatch(setAlert('Failed to update event', 'error'));
    throw err;
  }
};

// Delete event
export const deleteEvent = id => async dispatch => {
  try {
    await axios.delete(`/api/events/${id}`);
    dispatch({
      type: DELETE_EVENT,
      payload: id
    });
    dispatch(setAlert('Event Deleted Successfully', 'success'));
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
    dispatch(setAlert('Failed to delete event', 'error'));
  }
};

// Search events
export const searchEvents = keyword => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get(`/api/events/search?keyword=${keyword}`);
    dispatch({
      type: SEARCH_EVENTS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Filter events by category
export const filterEventsByCategory = category => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get(`/api/events/category/${category}`);
    dispatch({
      type: FILTER_EVENTS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get events by organizer (used in OrganizerHome and OrganizerEvents)
export const getEventsByOrganizer = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get('/api/events/organizer');
    dispatch({
      type: GET_EVENTS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get organizer stats (used in OrganizerDashboard)
export const getOrganizerStats = () => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get('/api/events/organizer/stats');
    dispatch({
      type: GET_ORGANIZER_STATS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get event analytics (used in OrganizerAnalytics)
// Expects an event id and a timeRange parameter (e.g., 'all', 'today', 'week', 'month', 'year')
export const getEventAnalytics = (id, timeRange) => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get(`/api/events/${id}/analytics?timeRange=${timeRange}`);
    dispatch({
      type: GET_EVENT_ANALYTICS,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Get event attendees (used in OrganizerAttendees)
export const getEventAttendees = eventId => async dispatch => {
  dispatch({ type: SET_LOADING });
  try {
    const res = await axios.get(`/api/events/${eventId}/attendees`);
    dispatch({
      type: GET_EVENT_ATTENDEES,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: EVENT_ERROR,
      payload: err.response.data.message
    });
  }
};

// Export attendee list (used in OrganizerAttendees)
export const exportAttendeeList = eventId => async dispatch => {
  try {
    const res = await axios.get(`/api/events/${eventId}/attendees/export`, { responseType: 'blob' });
    const url = window.URL.createObjectURL(new Blob([res.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download', 'attendees.csv');
    document.body.appendChild(link);
    link.click();
    link.parentNode.removeChild(link);
    dispatch(setAlert('Attendee list exported successfully', 'success'));
  } catch (err) {
    dispatch(setAlert('Failed to export attendee list', 'error'));
  }
};
