import { createStore, applyMiddleware } from 'redux';
import { thunk } from 'redux-thunk';
import rootReducer from './reducers';

const initialState = {};
const middleware = [thunk];

// For Redux 5, use the native DevTools integration
const enhancer = process.env.NODE_ENV === 'development' && 
                 typeof window === 'object' && 
                 window.__REDUX_DEVTOOLS_EXTENSION__ ? 
                   window.__REDUX_DEVTOOLS_EXTENSION__() : 
                   undefined;

const store = createStore(
  rootReducer,
  initialState,
  enhancer ? 
    // If enhancer exists, combine it with middleware
    (createStore) => enhancer(applyMiddleware(...middleware)(createStore)) : 
    // If no enhancer, just use middleware
    applyMiddleware(...middleware)
);

export default store;