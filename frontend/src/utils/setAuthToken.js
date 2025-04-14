import axios from 'axios';

const apiBaseUrl = process.env.REACT_APP_API_URL;

// Example API call
axios.get(`${apiBaseUrl}/api/events`)
  .then(response => {
    console.log('Data:', response.data);
  })
  .catch(error => {
    console.error('Error fetching data:', error);
  });

const setAuthToken = token => {
  if (token) {
    axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;
  } else {
    delete axios.defaults.headers.common['Authorization'];
  }
};

export default setAuthToken;
