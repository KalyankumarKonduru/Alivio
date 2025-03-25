import axios from 'axios';
import {
  REGISTER_SUCCESS,
  REGISTER_FAIL,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  USER_LOADED,
  AUTH_ERROR
  // Optionally, add PROFILE_UPDATED and PASSWORD_CHANGED if your reducers handle them
} from '../constants/actionTypes';
import { setAlert } from './alertActions';
import setAuthToken from '../../utils/setAuthToken';

// Load User
export const loadUser = () => async dispatch => {
  if (localStorage.token) {
    setAuthToken(localStorage.token);
  }

  try {
    const res = await axios.get('/api/auth/me');
    dispatch({
      type: USER_LOADED,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
      type: AUTH_ERROR
    });
  }
};

// Register User
export const register = ({ firstName, lastName, email, password, role, phoneNumber, address }) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const body = JSON.stringify({ firstName, lastName, email, password, role ,phoneNumber, address});

  try {
    const res = await axios.post('/api/auth/register', body, config);
    dispatch({
      type: REGISTER_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(setAlert('Registration Successful', 'success'));
  } catch (err) {
    const errors = err.response.data.message;
    if (errors) {
      dispatch(setAlert(errors, 'error'));
    }
    dispatch({
      type: REGISTER_FAIL,
      payload: errors
    });
  }
};

// Login User
export const login = (email, password) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post('/api/auth/login', body, config);
    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data
    });
    dispatch(loadUser());
    dispatch(setAlert('Login Successful', 'success'));
  } catch (err) {
    const errors = err.response.data.message;
    if (errors) {
      dispatch(setAlert(errors, 'error'));
    }
    dispatch({
      type: LOGIN_FAIL,
      payload: errors
    });
  }
};

// Logout
export const logout = () => dispatch => {
  dispatch({ type: LOGOUT });
  dispatch(setAlert('Logged out successfully', 'success'));
};

// Update Profile
export const updateProfile = (userData) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    // Adjust the endpoint as per your backend API
    const res = await axios.put('/api/auth/updateProfile', userData, config);
    // Optionally dispatch an action to update the user in the store
    // dispatch({ type: PROFILE_UPDATED, payload: res.data.data });
    dispatch(setAlert('Profile updated successfully', 'success'));
    return res.data.data;
  } catch (err) {
    const errors = err.response?.data?.message || 'Failed to update profile';
    dispatch(setAlert(errors, 'error'));
    throw err;
  }
};

// Change Password
export const changePassword = (passwordData) => async dispatch => {
  const config = {
    headers: { 'Content-Type': 'application/json' }
  };

  try {
    // Adjust the endpoint as per your backend API
    const res = await axios.put('/api/auth/changePassword', passwordData, config);
    // Optionally dispatch an action if needed
    // dispatch({ type: PASSWORD_CHANGED, payload: res.data.data });
    dispatch(setAlert('Password changed successfully', 'success'));
    return res.data.data;
  } catch (err) {
    const errors = err.response?.data?.message || 'Failed to change password';
    dispatch(setAlert(errors, 'error'));
    throw err;
  }
};
