import {
  GET_TICKETS,
  GET_TICKET,
  TICKET_ERROR,
  CREATE_TICKET,
  UPDATE_TICKET,
  DELETE_TICKET,
  SET_LOADING
} from '../constants/actionTypes';

const initialState = {
  tickets: [],
  ticket: null,
  loading: true,
  error: null
};

const ticketReducer = (state = initialState, action) => {
  const { type, payload } = action;

  switch (type) {
    case SET_LOADING:
      return {
        ...state,
        loading: true
      };
    case GET_TICKETS:
      return {
        ...state,
        tickets: payload,
        loading: false
      };
    case GET_TICKET:
      return {
        ...state,
        ticket: payload,
        loading: false
      };
    case CREATE_TICKET:
      return {
        ...state,
        tickets: [payload, ...state.tickets],
        loading: false
      };
    case UPDATE_TICKET:
      return {
        ...state,
        tickets: state.tickets.map(ticket => 
          ticket._id === payload._id ? payload : ticket
        ),
        loading: false
      };
    case DELETE_TICKET:
      return {
        ...state,
        tickets: state.tickets.filter(ticket => ticket._id !== payload),
        loading: false
      };
    case TICKET_ERROR:
      return {
        ...state,
        error: payload,
        loading: false
      };
    default:
      return state;
  }
};

export default ticketReducer;
