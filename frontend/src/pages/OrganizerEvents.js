import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
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
  makeStyles
} from '@material-ui/core';
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
}));

const OrganizerEvents = ({ getEventsByOrganizer, deleteEvent, events: { organizerEvents, loading } }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
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
  
  const handleDeleteEvent = (eventId) => {
    if (window.confirm('Are you sure you want to delete this event? This action cannot be undone.')) {
      deleteEvent(eventId);
    }
  };
  
  const getStatusColor = (status) => {
    switch (status) {
      case 'upcoming':
        return { bgcolor: 'info.light', color: 'info.contrastText' };
      case 'ongoing':
        return { bgcolor: 'success.light', color: 'success.contrastText' };
      case 'completed':
        return { bgcolor: 'text.disabled', color: 'background.paper' };
      case 'cancelled':
        return { bgcolor: 'error.light', color: 'error.contrastText' };
      default:
        return { bgcolor: 'grey.300', color: 'text.primary' };
    }
  };
  
  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <Container className={classes.container}>
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
                  <TableCell>Date</TableCell>
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
                    <TableCell>
                      {new Date(event.date).toLocaleDateString()}
                    </TableCell>
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
                      >
                        Delete
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
  events: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events
});

export default connect(mapStateToProps, { getEventsByOrganizer, deleteEvent })(OrganizerEvents);
