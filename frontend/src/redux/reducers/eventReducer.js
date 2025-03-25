import {
  GET_EVENTS,
  GET_EVENT,
  EVENT_ERROR,
  CREATE_EVENT,
  UPDATE_EVENT,
  DELETE_EVENT,
  SEARCH_EVENTS,
  FILTER_EVENTS
} from '../constants/actionTypes';

const initialState = {
  events: [],
  event: null,
  loading: true,
  error: null,
  filteredEvents: []
};

const eventReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case GET_EVENTS:
      return {
        ...state,
        events: payload,
        loading: false
      };
    case GET_EVENT:
      return {
        ...state,
        event: payload,
        loading: false
      };
    case CREATE_EVENT:
      return {
        ...state,
        events: [payload, ...state.events],
        loading: false
      };
    case UPDATE_EVENT:
      return {
        ...state,
        events: state.events.map(event => 
          event._id === payload._id ? payload : event
        ),
        loading: false
      };
    case DELETE_EVENT:
      return {
        ...state,
        events: state.events.filter(event => event._id !== payload),
        loading: false
      };
    case SEARCH_EVENTS:
      return {
        ...state,
        filteredEvents: payload,
        loading: false
      };
    case FILTER_EVENTS:
      return {
        ...state,
        filteredEvents: payload,
        loading: false
      };
    case EVENT_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default eventReducer;
