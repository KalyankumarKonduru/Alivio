import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  makeStyles
} from '@material-ui/core';
import { Save, Event } from '@material-ui/icons';
import { createEvent } from '../redux/actions/eventActions';
import { useNavigate } from 'react-router-dom';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
  },
  formControl: {
    marginBottom: theme.spacing(2),
    minWidth: '100%',
  },
  submitButton: {
    marginTop: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  }
}));

const CreateEvent = ({ createEvent }) => {
  const classes = useStyles();
  const history = useNavigate();
  
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    date: '',
    time: '',
    venueName: '',
    venueStreet: '',
    venueCity: '',
    venueState: '',
    venueZipCode: '',
    venueCountry: '',
    mainImage: '',
    ageRestriction: 'All Ages',
    status: 'upcoming'
  });
  
  const [errors, setErrors] = useState({});
  
  const {
    title,
    description,
    category,
    subCategory,
    date,
    time,
    venueName,
    venueStreet,
    venueCity,
    venueState,
    venueZipCode,
    venueCountry,
    mainImage,
    ageRestriction,
    status
  } = formData;
  
  const onChange = e => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const validateForm = () => {
    const newErrors = {};
    
    if (!title) newErrors.title = 'Title is required';
    if (!description) newErrors.description = 'Description is required';
    if (!category) newErrors.category = 'Category is required';
    if (!date) newErrors.date = 'Date is required';
    if (!time) newErrors.time = 'Time is required';
    if (!venueName) newErrors.venueName = 'Venue name is required';
    if (!venueCity) newErrors.venueCity = 'City is required';
    if (!venueCountry) newErrors.venueCountry = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onSubmit = async e => {
    e.preventDefault();
    
    if (validateForm()) {
      // Format data for API
      const eventData = {
        title,
        description,
        category,
        subCategory,
        date: new Date(`${date}T${time}`),
        time,
        venue: {
          name: venueName,
          address: {
            street: venueStreet,
            city: venueCity,
            state: venueState,
            zipCode: venueZipCode,
            country: venueCountry
          }
        },
        mainImage,
        ageRestriction,
        status
      };
      
      try {
        const createdEvent = await createEvent(eventData);
        history.push(`/organizer/events`);
      } catch (err) {
        console.error('Error creating event:', err);
      }
    }
  };
  
  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        Create New Event
      </Typography>
      
      <Paper className={classes.paper}>
        <form onSubmit={onSubmit}>
          <Grid container spacing={3}>
            <Grid item xs={12}>
              <TextField
                name="title"
                label="Event Title"
                variant="outlined"
                fullWidth
                value={title}
                onChange={onChange}
                error={!!errors.title}
                helperText={errors.title}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="description"
                label="Event Description"
                variant="outlined"
                fullWidth
                multiline
                rows={4}
                value={description}
                onChange={onChange}
                error={!!errors.description}
                helperText={errors.description}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl} error={!!errors.category} required>
                <InputLabel id="category-label">Category</InputLabel>
                <Select
                  labelId="category-label"
                  id="category"
                  name="category"
                  value={category}
                  onChange={onChange}
                  label="Category"
                >
                  <MenuItem value="">Select a category</MenuItem>
                  <MenuItem value="Music">Music</MenuItem>
                  <MenuItem value="Sports">Sports</MenuItem>
                  <MenuItem value="Arts & Theater">Arts & Theater</MenuItem>
                  <MenuItem value="Family">Family</MenuItem>
                  <MenuItem value="Comedy">Comedy</MenuItem>
                  <MenuItem value="Festivals">Festivals</MenuItem>
                  <MenuItem value="Film">Film</MenuItem>
                  <MenuItem value="Miscellaneous">Miscellaneous</MenuItem>
                </Select>
                {errors.category && <FormHelperText>{errors.category}</FormHelperText>}
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="subCategory"
                label="Sub-Category (Optional)"
                variant="outlined"
                fullWidth
                value={subCategory}
                onChange={onChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="date"
                label="Event Date"
                type="date"
                variant="outlined"
                fullWidth
                value={date}
                onChange={onChange}
                error={!!errors.date}
                helperText={errors.date}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="time"
                label="Event Time"
                type="time"
                variant="outlined"
                fullWidth
                value={time}
                onChange={onChange}
                error={!!errors.time}
                helperText={errors.time}
                required
                InputLabelProps={{
                  shrink: true,
                }}
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography variant="h6" className={classes.sectionTitle}>
                Venue Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="venueName"
                label="Venue Name"
                variant="outlined"
                fullWidth
                value={venueName}
                onChange={onChange}
                error={!!errors.venueName}
                helperText={errors.venueName}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="venueStreet"
                label="Street Address"
                variant="outlined"
                fullWidth
                value={venueStreet}
                onChange={onChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="venueCity"
                label="City"
                variant="outlined"
                fullWidth
                value={venueCity}
                onChange={onChange}
                error={!!errors.venueCity}
                helperText={errors.venueCity}
                required
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="venueState"
                label="State/Province"
                variant="outlined"
                fullWidth
                value={venueState}
                onChange={onChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="venueZipCode"
                label="Zip/Postal Code"
                variant="outlined"
                fullWidth
                value={venueZipCode}
                onChange={onChange}
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <TextField
                name="venueCountry"
                label="Country"
                variant="outlined"
                fullWidth
                value={venueCountry}
                onChange={onChange}
                error={!!errors.venueCountry}
                helperText={errors.venueCountry}
                required
              />
            </Grid>
            
            <Grid item xs={12}>
              <Divider className={classes.divider} />
              <Typography variant="h6" className={classes.sectionTitle}>
                Additional Information
              </Typography>
            </Grid>
            
            <Grid item xs={12}>
              <TextField
                name="mainImage"
                label="Main Image URL (Optional)"
                variant="outlined"
                fullWidth
                value={mainImage}
                onChange={onChange}
                helperText="Enter a URL for the event's main image"
              />
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="age-restriction-label">Age Restriction</InputLabel>
                <Select
                  labelId="age-restriction-label"
                  id="ageRestriction"
                  name="ageRestriction"
                  value={ageRestriction}
                  onChange={onChange}
                  label="Age Restriction"
                >
                  <MenuItem value="All Ages">All Ages</MenuItem>
                  <MenuItem value="18+">18+</MenuItem>
                  <MenuItem value="21+">21+</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12} md={6}>
              <FormControl variant="outlined" className={classes.formControl}>
                <InputLabel id="status-label">Event Status</InputLabel>
                <Select
                  labelId="status-label"
                  id="status"
                  name="status"
                  value={status}
                  onChange={onChange}
                  label="Event Status"
                >
                  <MenuItem value="upcoming">Upcoming</MenuItem>
                  <MenuItem value="ongoing">Ongoing</MenuItem>
                  <MenuItem value="completed">Completed</MenuItem>
                  <MenuItem value="cancelled">Cancelled</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            
            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                color="primary"
                size="large"
                className={classes.submitButton}
                startIcon={<Save />}
              >
                Create Event
              </Button>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired
};

export default connect(null, { createEvent })(CreateEvent);
