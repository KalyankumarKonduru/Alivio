import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Paper,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  makeStyles,
} from '@material-ui/core'; // Removed unused Grid import
import { Add, Edit, Delete, Visibility } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { deleteEvent, getEventsByOrganizer } from '../redux/actions/eventActions';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  addButton: {
    marginBottom: theme.spacing(3),
  },
  actionButton: {
    margin: theme.spacing(0.5),
  },
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  statusChip: {
    padding: theme.spacing(0.5, 1.5),
    borderRadius: 16,
    display: 'inline-block',
    textAlign: 'center',
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  errorMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
    color: theme.palette.error.main,
  },
  feedbackMessage: {
    position: 'fixed',
    top: theme.spacing(2),
    right: theme.spacing(2),
    padding: theme.spacing(1, 2),
    borderRadius: theme.shape.borderRadius,
    zIndex: 1000,
    boxShadow: theme.shadows[3],
  },
  successMessage: {
    backgroundColor: theme.palette.success.light,
    color: theme.palette.success.contrastText,
  },
  errorMessageFeedback: {
    backgroundColor: theme.palette.error.light,
    color: theme.palette.error.contrastText,
  },
}));

const OrganizerEvents = ({ getEventsByOrganizer, deleteEvent, events: { organizerEvents, loading, error } }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  const [deletingEventId, setDeletingEventId] = useState(null); // Track which event is being deleted
  const [feedback, setFeedback] = useState({ show: false, message: '', severity: 'success' }); // Feedback state

  useEffect(() => {
    getEventsByOrganizer();
  }, [getEventsByOrganizer]);

  const handleCreateEvent = () => {
    navigate('/organizer/events/create');
  };

  const handleEditEvent = (eventId) => {
    navigate(`/organizer/events/edit/${eventId}`);
  };

  const handleViewEvent = (eventId) => {
    navigate(`/events/${eventId}`);
  };

  const handleDeleteEvent = async (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      setDeletingEventId(eventId); // Disable the delete button for this event
      try {
        await deleteEvent(eventId); // Assuming deleteEvent returns a promise
        setFeedback({ show: true, message: 'Event deleted successfully!', severity: 'success' });
      } catch (err) {
        setFeedback({ show: true, message: 'Failed to delete event. Please try again.', severity: 'error' });
      } finally {
        setDeletingEventId(null); // Re-enable the delete button
      }

      // Hide the feedback message after 6 seconds
      setTimeout(() => {
        setFeedback((prev) => ({ ...prev, show: false }));
      }, 6000);
    }
  };

  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return { bgcolor: '#BBDEFB', color: '#1565C0' }; // Blue
      case 'ongoing':
        return { bgcolor: '#C8E6C9', color: '#2E7D32' }; // Green
      case 'completed':
        return { bgcolor: '#E0E0E0', color: '#424242' }; // Grey
      case 'cancelled':
        return { bgcolor: '#FFCDD2', color: '#C62828' }; // Red
      default:
        return { bgcolor: '#B0BEC5', color: '#263238' }; // Default grey
    }
  };

  const formatDate = (dateString) => {
    const options = { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  if (error) {
    return (
      <Container className={classes.container}>
        <Typography variant="h6" className={classes.errorMessage}>
          Failed to load events. Please try again later.
        </Typography>
        <Box textAlign="center">
          <Button
            variant="contained"
            color="primary"
            onClick={() => getEventsByOrganizer()}
          >
            Retry
          </Button>
        </Box>
      </Container>
    );
  }

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

      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h4" gutterBottom>
          My Events
        </Typography>
        
        <Button
          variant="contained"
          color="primary"
          startIcon={<Add />}
          className={classes.addButton}
          onClick={handleCreateEvent}
        >
          Create New Event
        </Button>
      </Box>
      
      <Paper className={classes.paper}>
        {organizerEvents && organizerEvents.length > 0 ? (
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Event Name</TableCell>
                  <TableCell>Date & Time</TableCell>
                  <TableCell>Venue</TableCell>
                  <TableCell>Tickets Sold</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {organizerEvents.map((event) => (
                  <TableRow key={event._id}>
                    <TableCell>{event.title}</TableCell>
                    <TableCell>{formatDate(event.date)}</TableCell>
                    <TableCell>
                      {event.venue.name}, {event.venue.address.city}
                    </TableCell>
                    <TableCell>
                      {event.ticketsSold || 0} / {event.totalTickets || 0}
                    </TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        className={classes.statusChip}
                        bgcolor={getStatusColor(event.status).bgcolor}
                        color={getStatusColor(event.status).color}
                      >
                        {event.status.charAt(0).toUpperCase() + event.status.slice(1)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.actionButton}
                        startIcon={<Visibility />}
                        onClick={() => handleViewEvent(event._id)}
                      >
                        View
                      </Button>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.actionButton}
                        startIcon={<Edit />}
                        onClick={() => handleEditEvent(event._id)}
                      >
                        Edit
                      </Button>
                      <Button
                        variant="outlined"
                        color="secondary"
                        size="small"
                        className={classes.actionButton}
                        startIcon={<Delete />}
                        onClick={() => handleDeleteEvent(event._id)}
                        disabled={deletingEventId === event._id}
                      >
                        {deletingEventId === event._id ? 'Deleting...' : 'Delete'}
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={classes.emptyMessage}>
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Events Found
            </Typography>
            <Typography variant="body1" color="textSecondary" paragraph>
              You haven't created any events yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              startIcon={<Add />}
              onClick={handleCreateEvent}
            >
              Create Your First Event
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

OrganizerEvents.propTypes = {
  getEventsByOrganizer: PropTypes.func.isRequired,
  deleteEvent: PropTypes.func.isRequired,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  events: state.events,
});

export default connect(mapStateToProps, { getEventsByOrganizer, deleteEvent })(OrganizerEvents);