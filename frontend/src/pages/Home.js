import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Container, 
  Grid, 
  Typography, 
  Card, 
  CardContent, 
  CardMedia, 
  Button, 
  TextField, 
  InputAdornment, 
  Tabs, 
  Tab, 
  Box, 
  CircularProgress,
  makeStyles 
} from '@material-ui/core';
import { Search } from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { getEvents, searchEvents, filterEventsByCategory } from '../redux/actions/eventActions';

const useStyles = makeStyles((theme) => ({
  heroContent: {
    backgroundColor: theme.palette.background.paper,
    padding: theme.spacing(8, 0, 6),
    backgroundImage: 'linear-gradient(rgba(0, 0, 0, 0.5), rgba(0, 0, 0, 0.5)), url(https://source.unsplash.com/random/1600x900/?concert)',
    backgroundSize: 'cover',
    backgroundPosition: 'center',
    color: theme.palette.common.white,
  },
  heroButtons: {
    marginTop: theme.spacing(4),
  },
  cardGrid: {
    paddingTop: theme.spacing(8),
    paddingBottom: theme.spacing(8),
  },
  card: {
    height: '100%',
    display: 'flex',
    flexDirection: 'column',
    transition: 'transform 0.3s ease-in-out',
    '&:hover': {
      transform: 'scale(1.03)',
    },
  },
  cardMedia: {
    paddingTop: '56.25%', // 16:9
    height: 0,
  },
  cardContent: {
    flexGrow: 1,
  },
  eventTitle: {
    fontWeight: 'bold',
  },
  eventDate: {
    marginTop: theme.spacing(1),
  },
  eventVenue: {
    marginTop: theme.spacing(1),
    color: theme.palette.text.secondary,
  },
  searchBar: {
    marginBottom: theme.spacing(4),
    marginTop: theme.spacing(4),
  },
  tabsContainer: {
    marginBottom: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '200px',
  },
}));

function TabPanel(props) {
  const { children, value, index, ...other } = props;

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box p={3}>
          {children}
        </Box>
      )}
    </div>
  );
}

const Home = ({ getEvents, searchEvents, filterEventsByCategory, events: { events, filteredEvents, loading } }) => {
  const classes = useStyles();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  const [displayEvents, setDisplayEvents] = useState([]);

  useEffect(() => {
    getEvents();
  }, [getEvents]);

  useEffect(() => {
    if (filteredEvents && filteredEvents.length > 0) {
      setDisplayEvents(filteredEvents);
    } else {
      setDisplayEvents(events);
    }
  }, [events, filteredEvents]);

  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    if (searchTerm.trim()) {
      searchEvents(searchTerm);
    } else {
      getEvents();
    }
  };

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
    
    const categories = ['Music', 'Sports', 'Arts & Theater', 'Family', 'Comedy', 'Festivals'];
    if (newValue === 0) {
      getEvents();
    } else {
      filterEventsByCategory(categories[newValue - 1]);
    }
  };

  const formatDate = (dateString) => {
    const options = { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <>
      <div className={classes.heroContent}>
        <Container maxWidth="sm">
          <Typography component="h1" variant="h2" align="center" gutterBottom>
            Find Your Next Event
          </Typography>
          <Typography variant="h5" align="center" paragraph>
            Discover concerts, sports, arts, comedy, and more. Get tickets to the events you love!
          </Typography>
          <div className={classes.heroButtons}>
            <Grid container spacing={2} justifyContent="center">
              <Grid item>
                <Button component={Link} to="/register" variant="contained" color="primary">
                  Sign Up
                </Button>
              </Grid>
              <Grid item>
                <Button component={Link} to="/login" variant="outlined" color="secondary">
                  Login
                </Button>
              </Grid>
            </Grid>
          </div>
        </Container>
      </div>
      <Container className={classes.cardGrid} maxWidth="lg">
        <form onSubmit={handleSearchSubmit}>
          <TextField
            className={classes.searchBar}
            variant="outlined"
            fullWidth
            placeholder="Search for events, artists, venues..."
            value={searchTerm}
            onChange={handleSearchChange}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <Search />
                </InputAdornment>
              ),
              endAdornment: (
                <InputAdornment position="end">
                  <Button type="submit" variant="contained" color="primary">
                    Search
                  </Button>
                </InputAdornment>
              ),
            }}
          />
        </form>

        <div className={classes.tabsContainer}>
          <Tabs
            value={tabValue}
            onChange={handleTabChange}
            indicatorColor="primary"
            textColor="primary"
            variant="scrollable"
            scrollButtons="auto"
          >
            <Tab label="All Events" />
            <Tab label="Music" />
            <Tab label="Sports" />
            <Tab label="Arts & Theater" />
            <Tab label="Family" />
            <Tab label="Comedy" />
            <Tab label="Festivals" />
          </Tabs>
        </div>

        {loading ? (
          <div className={classes.loadingContainer}>
            <CircularProgress />
          </div>
        ) : (
          <Grid container spacing={4}>
            {displayEvents && displayEvents.length > 0 ? (
              displayEvents.map((event) => (
                <Grid item key={event._id} xs={12} sm={6} md={4}>
                  <Card className={classes.card}>
                    <CardMedia
                      className={classes.cardMedia}
                      image={event.mainImage || `https://source.unsplash.com/random/800x600/?${event.category.toLowerCase()}`}
                      title={event.title}
                    />
                    <CardContent className={classes.cardContent}>
                      <Typography gutterBottom variant="h5" component="h2" className={classes.eventTitle}>
                        {event.title}
                      </Typography>
                      <Typography className={classes.eventDate}>
                        {formatDate(event.date)}
                      </Typography>
                      <Typography className={classes.eventVenue}>
                        {event.venue.name}, {event.venue.address.city}
                      </Typography>
                      <Button
                        component={Link}
                        to={`/events/${event._id}`}
                        variant="contained"
                        color="primary"
                        fullWidth
                        style={{ marginTop: '16px' }}
                      >
                        View Details
                      </Button>
                    </CardContent>
                  </Card>
                </Grid>
              ))
            ) : (
              <Container>
                <Typography variant="h5" align="center" style={{ marginTop: '32px' }}>
                  No events found. Try a different search or category.
                </Typography>
              </Container>
            )}
          </Grid>
        )}
      </Container>
    </>
  );
};

Home.propTypes = {
  getEvents: PropTypes.func.isRequired,
  searchEvents: PropTypes.func.isRequired,
  filterEventsByCategory: PropTypes.func.isRequired,
  events: PropTypes.object.isRequired,
};

const mapStateToProps = (state) => ({
  events: state.events,
});

export default connect(mapStateToProps, { getEvents, searchEvents, filterEventsByCategory })(Home);
