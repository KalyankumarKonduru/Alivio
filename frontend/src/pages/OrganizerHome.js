import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Card,
  CardContent,
  Button,
  Tabs,
  Tab,
  Box,
  Divider,
  List,
  ListItem,
  ListItemText,
  ListItemAvatar,
  Avatar,
  makeStyles
} from '@material-ui/core';
import {
  Dashboard as DashboardIcon,
  Event as EventIcon,
  People as PeopleIcon,
  BarChart as BarChartIcon,
  Add as AddIcon
} from '@material-ui/icons';
import { Link } from 'react-router-dom';
import { getEventsByOrganizer } from '../redux/actions/eventActions';
import { getOrganizerOrders } from '../redux/actions/orderActions';

const useStyles = makeStyles((theme) => ({
  dashboardContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
    display: 'flex',
    flexDirection: 'column',
    height: '100%',
  },
  welcomeSection: {
    marginBottom: theme.spacing(4),
  },
  statsGrid: {
    marginBottom: theme.spacing(4),
  },
  statCard: {
    height: '100%',
  },
  statValue: {
    fontSize: '2rem',
    fontWeight: 'bold',
    marginBottom: theme.spacing(1),
  },
  statLabel: {
    color: theme.palette.text.secondary,
  },
  sectionTitle: {
    marginBottom: theme.spacing(2),
    marginTop: theme.spacing(4),
  },
  createEventButton: {
    marginTop: theme.spacing(2),
  },
  eventItem: {
    marginBottom: theme.spacing(2),
  },
  tabPanel: {
    padding: theme.spacing(3),
  },
  avatar: {
    backgroundColor: theme.palette.primary.main,
  },
  listSection: {
    marginTop: theme.spacing(2),
    maxHeight: 400,
    overflow: 'auto',
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

const OrganizerHome = ({ 
  auth: { user }, 
  events: { events }, 
  orders: { orders },
  getEventsByOrganizer,
  getOrganizerOrders
}) => {
  const classes = useStyles();
  const [tabValue, setTabValue] = useState(0);

  useEffect(() => {
    getEventsByOrganizer();
    getOrganizerOrders();
  }, [getEventsByOrganizer, getOrganizerOrders]);

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  // Calculate stats
  const totalEvents = events ? events.length : 0;
  const upcomingEvents = events ? events.filter(event => new Date(event.date) > new Date()).length : 0;
  const totalAttendees = orders ? orders.reduce((acc, order) => {
    return acc + order.items.reduce((itemAcc, item) => itemAcc + item.quantity, 0);
  }, 0) : 0;
  const totalRevenue = orders ? orders.reduce((acc, order) => acc + order.totalAmount, 0) : 0;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className={classes.dashboardContainer}>
      <div className={classes.welcomeSection}>
        <Typography variant="h4" gutterBottom>
          Welcome, {user ? user.firstName : 'Organizer'}!
        </Typography>
        <Typography variant="body1" color="textSecondary">
          Manage your events, track ticket sales, and view attendee information from your dashboard.
        </Typography>
      </div>

      <Grid container spacing={3} className={classes.statsGrid}>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.statLabel}>
              Total Events
            </Typography>
            <Typography variant="h3" className={classes.statValue}>
              {totalEvents}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              {upcomingEvents} upcoming
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.statLabel}>
              Total Attendees
            </Typography>
            <Typography variant="h3" className={classes.statValue}>
              {totalAttendees}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Across all events
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.statLabel}>
              Total Revenue
            </Typography>
            <Typography variant="h3" className={classes.statValue}>
              ${totalRevenue.toFixed(2)}
            </Typography>
            <Typography variant="body2" color="textSecondary">
              From ticket sales
            </Typography>
          </Paper>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Paper className={classes.paper}>
            <Typography variant="h6" className={classes.statLabel}>
              Quick Actions
            </Typography>
            <Button
              component={Link}
              to="/organizer/events/create"
              variant="contained"
              color="primary"
              startIcon={<AddIcon />}
              className={classes.createEventButton}
              fullWidth
            >
              Create New Event
            </Button>
          </Paper>
        </Grid>
      </Grid>

      <Paper>
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab icon={<EventIcon />} label="Your Events" />
          <Tab icon={<PeopleIcon />} label="Recent Attendees" />
          <Tab icon={<BarChartIcon />} label="Sales Overview" />
        </Tabs>

        <TabPanel value={tabValue} index={0}>
          <Typography variant="h6" gutterBottom>
            Your Events
          </Typography>
          {events && events.length > 0 ? (
            <div className={classes.listSection}>
              <List>
                {events.map((event) => (
                  <Paper key={event._id} className={classes.eventItem}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <EventIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={event.title}
                        secondary={`${formatDate(event.date)} at ${event.venue.name}`}
                      />
                      <Button
                        component={Link}
                        to={`/events/${event._id}`}
                        color="primary"
                      >
                        View
                      </Button>
                      <Button
                        component={Link}
                        to={`/organizer/events/edit/${event._id}`}
                        color="secondary"
                      >
                        Edit
                      </Button>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </div>
          ) : (
            <Typography variant="body1">
              You haven't created any events yet. Create your first event to get started!
            </Typography>
          )}
          <Button
            component={Link}
            to="/organizer/events"
            variant="outlined"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            View All Events
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={1}>
          <Typography variant="h6" gutterBottom>
            Recent Attendees
          </Typography>
          {orders && orders.length > 0 ? (
            <div className={classes.listSection}>
              <List>
                {orders.slice(0, 10).map((order) => (
                  <Paper key={order._id} className={classes.eventItem}>
                    <ListItem>
                      <ListItemAvatar>
                        <Avatar className={classes.avatar}>
                          <PeopleIcon />
                        </Avatar>
                      </ListItemAvatar>
                      <ListItemText
                        primary={`${order.user.firstName} ${order.user.lastName}`}
                        secondary={`Order #${order.orderNumber} - ${formatDate(order.createdAt)}`}
                      />
                      <Typography variant="body2">
                        ${order.totalAmount.toFixed(2)}
                      </Typography>
                    </ListItem>
                  </Paper>
                ))}
              </List>
            </div>
          ) : (
            <Typography variant="body1">
              No attendees yet. Once people purchase tickets to your events, they'll appear here.
            </Typography>
          )}
          <Button
            component={Link}
            to="/organizer/attendees"
            variant="outlined"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            View All Attendees
          </Button>
        </TabPanel>

        <TabPanel value={tabValue} index={2}>
          <Typography variant="h6" gutterBottom>
            Sales Overview
          </Typography>
          <Typography variant="body1">
            This is a simplified dashboard. In a full implementation, this would include charts and graphs showing sales trends, popular events, and other analytics.
          </Typography>
          <Button
            component={Link}
            to="/organizer/analytics"
            variant="outlined"
            color="primary"
            style={{ marginTop: '16px' }}
          >
            View Detailed Analytics
          </Button>
        </TabPanel>
      </Paper>
    </Container>
  );
};

OrganizerHome.propTypes = {
  auth: PropTypes.object.isRequired,
  events: PropTypes.object.isRequired,
  orders: PropTypes.object.isRequired,
  getEventsByOrganizer: PropTypes.func.isRequired,
  getOrganizerOrders: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  events: state.events,
  orders: state.orders,
});

export default connect(mapStateToProps, { getEventsByOrganizer, getOrganizerOrders })(OrganizerHome);
