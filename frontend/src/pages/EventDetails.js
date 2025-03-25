import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useParams } from 'react-router-dom';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Divider, 
  Box, 
  CircularProgress,
  Paper,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  makeStyles 
} from '@material-ui/core';
import { 
  CalendarToday, 
  LocationOn, 
  LocalActivity,
  AttachMoney 
} from '@material-ui/icons';
import { GoogleMap, LoadScript, Marker } from '@react-google-maps/api';
import { getEventById } from '../redux/actions/eventActions';
import { getTicketsByEvent } from '../redux/actions/ticketActions';
import { addToCart } from '../redux/actions/cartActions';

const useStyles = makeStyles((theme) => ({
  eventContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(4),
  },
  eventImage: {
    width: '100%',
    height: 'auto',
    maxHeight: '400px',
    objectFit: 'cover',
    borderRadius: theme.shape.borderRadius,
  },
  eventDetails: {
    marginTop: theme.spacing(3),
  },
  eventTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  eventInfo: {
    display: 'flex',
    alignItems: 'center',
    marginBottom: theme.spacing(2),
  },
  icon: {
    marginRight: theme.spacing(1),
    color: theme.palette.primary.main,
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  ticketSection: {
    marginTop: theme.spacing(4),
  },
  ticketCard: {
    marginBottom: theme.spacing(2),
  },
  ticketType: {
    fontWeight: 'bold',
  },
  ticketPrice: {
    display: 'flex',
    alignItems: 'center',
    color: theme.palette.success.main,
    fontWeight: 'bold',
  },
  ticketActions: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginTop: theme.spacing(2),
  },
  quantitySelect: {
    minWidth: 80,
  },
  mapContainer: {
    height: '300px',
    width: '100%',
    marginTop: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  description: {
    whiteSpace: 'pre-line',
  },
}));

const EventDetails = ({ 
  getEventById, 
  getTicketsByEvent, 
  addToCart, 
  events: { event, loading: eventLoading }, 
  tickets: { tickets, loading: ticketsLoading },
  auth: { isAuthenticated }
}) => {
  const classes = useStyles();
  const { id } = useParams();
  const [selectedTickets, setSelectedTickets] = useState({});
  const [mapCenter, setMapCenter] = useState({ lat: 40.7128, lng: -74.0060 }); // Default to NYC

  useEffect(() => {
    getEventById(id);
    getTicketsByEvent(id);
  }, [getEventById, getTicketsByEvent, id]);

  useEffect(() => {
    if (event && event.venue && event.venue.location && event.venue.location.coordinates) {
      const [lng, lat] = event.venue.location.coordinates;
      setMapCenter({ lat, lng });
    }
  }, [event]);

  const handleQuantityChange = (ticketId, e) => {
    setSelectedTickets({
      ...selectedTickets,
      [ticketId]: parseInt(e.target.value)
    });
  };

  const handleAddToCart = (ticket) => {
    const quantity = selectedTickets[ticket._id] || 1;
    addToCart(ticket, event, quantity, ticket.price);
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  if (eventLoading || ticketsLoading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }

  return (
    <Container className={classes.eventContainer}>
      {event ? (
        <Grid container spacing={4}>
          <Grid item xs={12}>
            <img 
              src={event.mainImage || `https://source.unsplash.com/random/1200x400/?${event.category.toLowerCase()}`} 
              alt={event.title} 
              className={classes.eventImage} 
            />
          </Grid>
          <Grid item xs={12} md={8}>
            <div className={classes.eventDetails}>
              <Typography variant="h3" component="h1" className={classes.eventTitle}>
                {event.title}
              </Typography>
              
              <div className={classes.eventInfo}>
                <CalendarToday className={classes.icon} />
                <Typography variant="body1">
                  {formatDate(event.date)}
                </Typography>
              </div>
              
              <div className={classes.eventInfo}>
                <LocationOn className={classes.icon} />
                <Typography variant="body1">
                  {event.venue.name}, {event.venue.address.city}, {event.venue.address.country}
                </Typography>
              </div>
              
              <Divider className={classes.divider} />
              
              <Typography variant="h6" gutterBottom>
                About this event
              </Typography>
              <Typography variant="body1" className={classes.description} paragraph>
                {event.description}
              </Typography>
              
              <Box mt={4}>
                <Typography variant="h6" gutterBottom>
                  Location
                </Typography>
                <Typography variant="body1" paragraph>
                  {event.venue.name}<br />
                  {event.venue.address.street && `${event.venue.address.street}, `}
                  {event.venue.address.city}, {event.venue.address.state && `${event.venue.address.state}, `}
                  {event.venue.address.country} {event.venue.address.zipCode && event.venue.address.zipCode}
                </Typography>
                
                <div className={classes.mapContainer}>
                  <LoadScript googleMapsApiKey="AIzaSyAIni3U0Gz0lOG8kXrlxqGNq45AN7A9G9o">
                    <GoogleMap
                      mapContainerStyle={{ height: '100%', width: '100%' }}
                      center={mapCenter}
                      zoom={14}
                    >
                      <Marker position={mapCenter} />
                    </GoogleMap>
                  </LoadScript>
                </div>
              </Box>
            </div>
          </Grid>
          
          <Grid item xs={12} md={4}>
            <Paper elevation={3} style={{ padding: '20px' }}>
              <Typography variant="h5" gutterBottom>
                Tickets
              </Typography>
              
              {tickets && tickets.length > 0 ? (
                tickets.map((ticket) => (
                  <Card key={ticket._id} className={classes.ticketCard}>
                    <CardContent>
                      <Typography variant="h6" className={classes.ticketType}>
                        {ticket.type}
                      </Typography>
                      
                      <Typography variant="body2" color="textSecondary" gutterBottom>
                        {ticket.description || 'Standard admission'}
                      </Typography>
                      
                      <Typography variant="h6" className={classes.ticketPrice}>
                        <AttachMoney fontSize="small" />
                        {ticket.price.toFixed(2)}
                      </Typography>
                      
                      <div className={classes.ticketActions}>
                        <FormControl variant="outlined" className={classes.quantitySelect}>
                          <InputLabel id={`quantity-label-${ticket._id}`}>Qty</InputLabel>
                          <Select
                            labelId={`quantity-label-${ticket._id}`}
                            id={`quantity-select-${ticket._id}`}
                            value={selectedTickets[ticket._id] || 1}
                            onChange={(e) => handleQuantityChange(ticket._id, e)}
                            label="Qty"
                          >
                            {[...Array(Math.min(ticket.maxPerPurchase, 10)).keys()].map((i) => (
                              <MenuItem key={i + 1} value={i + 1}>
                                {i + 1}
                              </MenuItem>
                            ))}
                          </Select>
                        </FormControl>
                        
                        <Button
                          variant="contained"
                          color="primary"
                          startIcon={<LocalActivity />}
                          onClick={() => handleAddToCart(ticket)}
                          disabled={!isAuthenticated || ticket.soldOut}
                        >
                          {ticket.soldOut ? 'Sold Out' : 'Add to Cart'}
                        </Button>
                      </div>
                      
                      {!isAuthenticated && (
                        <Typography variant="body2" color="error" style={{ marginTop: '8px' }}>
                          Please login to purchase tickets
                        </Typography>
                      )}
                    </CardContent>
                  </Card>
                ))
              ) : (
                <Typography variant="body1">
                  No tickets available at this time.
                </Typography>
              )}
            </Paper>
          </Grid>
        </Grid>
      ) : (
        <Typography variant="h5" align="center">
          Event not found
        </Typography>
      )}
    </Container>
  );
};

EventDetails.propTypes = {
  getEventById: PropTypes.func.isRequired,
  getTicketsByEvent: PropTypes.func.isRequired,
  addToCart: PropTypes.func.isRequired,
  events: PropTypes.object.isRequired,
  tickets: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  events: state.events,
  tickets: state.tickets,
  auth: state.auth,
});

export default connect(mapStateToProps, { getEventById, getTicketsByEvent, addToCart })(EventDetails);
