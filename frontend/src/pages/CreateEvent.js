import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Paper,
  TextField,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  FormHelperText,
  Divider,
  IconButton,
  Card,
  CardContent,
  Grid,
  makeStyles,
} from '@material-ui/core';
import { Save, Event, Add, Delete } from '@material-ui/icons';
import { createEvent } from '../redux/actions/eventActions';
import { useNavigate } from 'react-router-dom';
import LocationInput from '../components/LocationInput'; // Adjust the path as needed

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
  },
  feedbackMessage: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    zIndex: 1000,
    boxShadow: theme.shadows[3],
    transition: 'opacity 0.3s ease-in-out',
  },
  successMessage: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  errorMessageFeedback: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
  fileInput: {
    marginTop: theme.spacing(2),
  },
  ticketSection: {
    marginTop: theme.spacing(3),
  },
  ticketCard: {
    marginBottom: theme.spacing(2),
  },
  addTicketButton: {
    marginTop: theme.spacing(2),
  },
  deleteButton: {
    color: theme.palette.error.main,
    marginLeft: theme.spacing(1),
  },
}));

const CreateEvent = ({ createEvent }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    subCategory: '',
    date: '',
    time: '',
    venueName: '',
    location: {
      address: '',
      city: '',
      state: '',
      country: '',
      zip: '',
      lat: null,
      lng: null,
    },
    mainImage: null, // Changed to store the file object instead of a URL
    ageRestriction: 'All Ages',
    status: 'upcoming',
  });
  
  // Ticket types
  const [tickets, setTickets] = useState([
    {
      type: 'General',
      price: '',
      quantity: '',
      description: '',
      maxPerPurchase: 10
    }
  ]);

  const [errors, setErrors] = useState({});
  const [feedback, setFeedback] = useState({ show: false, message: '', severity: 'success' });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const {
    title,
    description,
    category,
    subCategory,
    date,
    time,
    venueName,
    location,
    mainImage,
    ageRestriction,
    status,
  } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    console.log('Selected file:', file); // Debug: Log the selected file
    setFormData({ ...formData, mainImage: file });
    if (file) {
      console.log('File details:', {
        name: file.name,
        size: file.size,
        type: file.type,
      });
    }
  };

  const handleLocationChange = (locationData) => {
    setFormData((prev) => ({
      ...prev,
      location: locationData,
    }));
    if (errors.venueCity || errors.venueCountry) {
      setErrors((prev) => ({ ...prev, venueCity: null, venueCountry: null }));
    }
  };

  // Handle changes to ticket fields
  const handleTicketChange = (index, field, value) => {
    const updatedTickets = [...tickets];
    updatedTickets[index][field] = value;
    setTickets(updatedTickets);
  };

  // Add a new ticket type
  const addTicket = () => {
    setTickets([
      ...tickets,
      {
        type: 'General',
        price: '',
        quantity: '',
        description: '',
        maxPerPurchase: 10
      }
    ]);
  };

  // Remove a ticket type
  const removeTicket = (index) => {
    if (tickets.length > 1) {
      const updatedTickets = tickets.filter((_, i) => i !== index);
      setTickets(updatedTickets);
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
    if (!location.city) newErrors.venueCity = 'City is required';
    if (!location.country) newErrors.venueCountry = 'Country is required';
    
    // Validate tickets
    let ticketErrors = false;
    tickets.forEach((ticket, index) => {
      if (!ticket.price || isNaN(parseFloat(ticket.price))) {
        newErrors[`ticket_${index}_price`] = 'Valid price is required';
        ticketErrors = true;
      }
      if (!ticket.quantity || isNaN(parseInt(ticket.quantity))) {
        newErrors[`ticket_${index}_quantity`] = 'Valid quantity is required';
        ticketErrors = true;
      }
    });
    
    if (ticketErrors) {
      newErrors.tickets = 'Please fix errors in ticket information';
    }

    setErrors(newErrors);
    console.log('Validation errors:', newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    console.log('Form submitted');

    if (validateForm()) {
      console.log('Form validated successfully');

      // Create FormData object to handle file upload
      const formDataToSend = new FormData();
      formDataToSend.append('title', title);
      formDataToSend.append('description', description);
      formDataToSend.append('category', category);
      formDataToSend.append('subCategory', subCategory);
      formDataToSend.append('date', new Date(`${date}T${time}`).toISOString());
      formDataToSend.append('time', time);
      formDataToSend.append('venue[name]', venueName);
      formDataToSend.append('venue[address][street]', location.address);
      formDataToSend.append('venue[address][city]', location.city);
      formDataToSend.append('venue[address][state]', location.state);
      formDataToSend.append('venue[address][zipCode]', location.zip);
      formDataToSend.append('venue[address][country]', location.country);
      formDataToSend.append('venue[location][type]', 'Point');
      formDataToSend.append('venue[location][coordinates][0]', location.lng);
      formDataToSend.append('venue[location][coordinates][1]', location.lat);
      if (mainImage) {
        formDataToSend.append('mainImage', mainImage); // Append the file
        console.log('File appended to FormData:', mainImage); // Debug: Log the file object
      } else {
        console.log('No file selected for upload'); // Debug: Log if no file is selected
      }
      formDataToSend.append('ageRestriction', ageRestriction);
      formDataToSend.append('status', status);
      
      // Add tickets to the form data as a JSON string
      // This ensures the array structure is preserved
      formDataToSend.append('tickets', JSON.stringify(tickets));

      // Debug: Log all FormData entries
      for (let [key, value] of formDataToSend.entries()) {
        console.log(`FormData entry: ${key} =`, value);
      }

      setIsSubmitting(true);
      try {
        const response = await createEvent(formDataToSend);
        console.log('Create event response:', response);
        setFeedback({ show: true, message: 'Event created successfully!', severity: 'success' });
        setTimeout(() => {
          navigate('/organizer/events');
        }, 2000);
      } catch (err) {
        console.error('Error creating event:', err);
        console.error('Error response:', err.response?.data); // Debug: Log the error response
        setFeedback({ show: true, message: 'Failed to create event. Please try again.', severity: 'error' });
      } finally {
        setIsSubmitting(false);
      }

      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, show: false }));
      }, 6000);
    } else {
      console.log('Form validation failed');
    }
  };

  return (
    <Container className={classes.container}>
      {/* Feedback Message */}
      {feedback.show && (
        <Typography
          className={`${classes.feedbackMessage} ${
            feedback.severity === 'success' ? classes.successMessage : classes.errorMessageFeedback
          }`}
        >
          {feedback.message}
        </Typography>
      )}

      <Typography variant="h4" gutterBottom>
        Create New Event
      </Typography>

      <Paper className={classes.paper}>
        <form onSubmit={onSubmit} encType="multipart/form-data">
          <div>
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
          </div>

          <div style={{ marginTop: '16px' }}>
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
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
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

            <TextField
              name="subCategory"
              label="Sub-Category (Optional)"
              variant="outlined"
              fullWidth
              value={subCategory}
              onChange={onChange}
            />
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
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
          </div>

          <div style={{ marginTop: '16px' }}>
            <Divider className={classes.divider} />
            <Typography variant="h6" className={classes.sectionTitle}>
              Venue Information
            </Typography>
          </div>

          <div>
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
          </div>

          <div style={{ marginTop: '16px' }}>
            <LocationInput onLocationChange={handleLocationChange} />
            {(errors.venueCity || errors.venueCountry) && (
              <FormHelperText error>
                {errors.venueCity || errors.venueCountry}
              </FormHelperText>
            )}
          </div>

          <div style={{ marginTop: '16px' }}>
            <Divider className={classes.divider} />
            <Typography variant="h6" className={classes.sectionTitle}>
              Ticket Information
            </Typography>
          </div>
          
          <div className={classes.ticketSection}>
            {tickets.map((ticket, index) => (
              <Card key={index} className={classes.ticketCard}>
                <CardContent>
                  <Grid container spacing={2}>
                    <Grid item xs={12}>
                      <Typography variant="h6">
                        Ticket Type {index + 1}
                        {tickets.length > 1 && (
                          <IconButton
                            size="small"
                            className={classes.deleteButton}
                            onClick={() => removeTicket(index)}
                          >
                            <Delete />
                          </IconButton>
                        )}
                      </Typography>
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <FormControl variant="outlined" fullWidth>
                        <InputLabel id={`ticket-type-label-${index}`}>Type</InputLabel>
                        <Select
                          labelId={`ticket-type-label-${index}`}
                          value={ticket.type}
                          onChange={(e) => handleTicketChange(index, 'type', e.target.value)}
                          label="Type"
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
                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Price"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={ticket.price}
                        onChange={(e) => handleTicketChange(index, 'price', e.target.value)}
                        error={!!errors[`ticket_${index}_price`]}
                        helperText={errors[`ticket_${index}_price`]}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Quantity"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={ticket.quantity}
                        onChange={(e) => handleTicketChange(index, 'quantity', e.target.value)}
                        error={!!errors[`ticket_${index}_quantity`]}
                        helperText={errors[`ticket_${index}_quantity`]}
                        required
                      />
                    </Grid>
                    
                    <Grid item xs={12} md={3}>
                      <TextField
                        label="Max Per Purchase"
                        type="number"
                        variant="outlined"
                        fullWidth
                        value={ticket.maxPerPurchase}
                        onChange={(e) => handleTicketChange(index, 'maxPerPurchase', e.target.value)}
                      />
                    </Grid>
                    
                    <Grid item xs={12}>
                      <TextField
                        label="Ticket Description (Optional)"
                        variant="outlined"
                        fullWidth
                        value={ticket.description}
                        onChange={(e) => handleTicketChange(index, 'description', e.target.value)}
                      />
                    </Grid>
                  </Grid>
                </CardContent>
              </Card>
            ))}
            
            <Button
              variant="outlined"
              color="primary"
              startIcon={<Add />}
              onClick={addTicket}
              className={classes.addTicketButton}
            >
              Add Another Ticket Type
            </Button>
          </div>

          <div style={{ marginTop: '16px' }}>
            <Divider className={classes.divider} />
            <Typography variant="h6" className={classes.sectionTitle}>
              Additional Information
            </Typography>
          </div>

          <div className={classes.fileInput}>
            <Typography variant="body1" gutterBottom>
              Main Image (Optional)
            </Typography>
            <input
              type="file"
              name="mainImage"
              accept="image/*"
              onChange={handleFileChange}
            />
            {mainImage && (
              <Typography variant="body2" color="textSecondary">
                Selected file: {mainImage.name}
              </Typography>
            )}
          </div>

          <div style={{ marginTop: '16px', display: 'flex', gap: '16px' }}>
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
          </div>

          <div style={{ marginTop: '16px' }}>
            <Button
              type="submit"
              variant="contained"
              color="primary"
              size="large"
              className={classes.submitButton}
              startIcon={<Save />}
              disabled={isSubmitting}
            >
              {isSubmitting ? 'Creating...' : 'Create Event'}
            </Button>
          </div>
        </form>
      </Paper>
    </Container>
  );
};

CreateEvent.propTypes = {
  createEvent: PropTypes.func.isRequired,
};

export default connect(null, { createEvent })(CreateEvent);