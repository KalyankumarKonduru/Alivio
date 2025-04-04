import React, { useState } from 'react';
import axios from 'axios';
import {
  Button,
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Typography,
  Paper,
  Grid,
  makeStyles
} from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  paper: {
    padding: theme.spacing(3),
    margin: theme.spacing(3),
    maxWidth: 600,
    marginLeft: 'auto',
    marginRight: 'auto'
  },
  title: {
    marginBottom: theme.spacing(3)
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  submitButton: {
    marginTop: theme.spacing(2),
  },
  message: {
    marginTop: theme.spacing(2),
  },
  success: {
    color: theme.palette.success.main,
  },
  error: {
    color: theme.palette.error.main,
  }
}));

const AddTicketForm = () => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    eventId: '67ef428399a428d2bac9547d', // Default to the test event ID
    type: 'General',
    price: '',
    quantity: '',
    description: '',
    maxPerPurchase: 10
  });
  const [message, setMessage] = useState(null);
  
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };
  
  const handleSubmit = async (e) => {
    e.preventDefault();
    setMessage(null);
    
    try {
      // Create ticket directly via API
      const response = await axios.post('/api/tickets', {
        event: formData.eventId,
        type: formData.type,
        price: parseFloat(formData.price),
        quantity: parseInt(formData.quantity),
        description: formData.description,
        maxPerPurchase: parseInt(formData.maxPerPurchase)
      });
      
      setMessage({
        type: 'success',
        text: `Ticket created successfully! ID: ${response.data.data._id}`
      });
      
      // Reset form
      setFormData({
        ...formData,
        price: '',
        quantity: '',
        description: ''
      });
    } catch (error) {
      console.error('Error creating ticket:', error);
      setMessage({
        type: 'error',
        text: error.response?.data?.message || 'Error creating ticket'
      });
    }
  };
  
  return (
    <Paper className={classes.paper}>
      <Typography variant="h5" className={classes.title}>
        Add Ticket to Test Event
      </Typography>
      
      <form onSubmit={handleSubmit}>
        <Grid container spacing={2}>
          <Grid item xs={12}>
            <TextField
              label="Event ID"
              name="eventId"
              value={formData.eventId}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <FormControl variant="outlined" className={classes.formControl}>
              <InputLabel id="ticket-type-label">Ticket Type</InputLabel>
              <Select
                labelId="ticket-type-label"
                name="type"
                value={formData.type}
                onChange={handleChange}
                label="Ticket Type"
                required
              >
                <MenuItem value="General">General</MenuItem>
                <MenuItem value="VIP">VIP</MenuItem>
                <MenuItem value="Premium">Premium</MenuItem>
                <MenuItem value="Early Bird">Early Bird</MenuItem>
                <MenuItem value="Group">Group</MenuItem>
                <MenuItem value="Student">Student</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Price"
              name="price"
              type="number"
              value={formData.price}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Quantity"
              name="quantity"
              type="number"
              value={formData.quantity}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              required
            />
          </Grid>
          
          <Grid item xs={12} md={6}>
            <TextField
              label="Max Per Purchase"
              name="maxPerPurchase"
              type="number"
              value={formData.maxPerPurchase}
              onChange={handleChange}
              fullWidth
              variant="outlined"
            />
          </Grid>
          
          <Grid item xs={12}>
            <TextField
              label="Description"
              name="description"
              value={formData.description}
              onChange={handleChange}
              fullWidth
              variant="outlined"
              multiline
              rows={2}
            />
          </Grid>
          
          <Grid item xs={12}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              fullWidth
              className={classes.submitButton}
            >
              Add Ticket
            </Button>
          </Grid>
        </Grid>
      </form>
      
      {message && (
        <Typography 
          className={`${classes.message} ${message.type === 'success' ? classes.success : classes.error}`}
        >
          {message.text}
        </Typography>
      )}
    </Paper>
  );
};

export default AddTicketForm;