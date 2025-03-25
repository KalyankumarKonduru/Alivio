import React, { useEffect, useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Box,
  CircularProgress,
  TextField,
  InputAdornment,
  Button,
  Tabs,
  Tab,
  makeStyles
} from '@material-ui/core';
import { Search, Mail, GetApp } from '@material-ui/icons';
import { useParams } from 'react-router-dom';
import { getEventAttendees, exportAttendeeList } from '../redux/actions/eventActions';

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
  searchField: {
    marginBottom: theme.spacing(3),
  },
  tabPanel: {
    padding: theme.spacing(3, 0),
  },
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
  exportButton: {
    marginLeft: theme.spacing(2),
  },
  actionButtons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginBottom: theme.spacing(2),
  },
}));

// Tab Panel component
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  const classes = useStyles();

  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      className={classes.tabPanel}
      {...other}
    >
      {value === index && (
        <Box>
          {children}
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.any.isRequired,
  value: PropTypes.any.isRequired,
};

const OrganizerAttendees = ({ 
  getEventAttendees, 
  exportAttendeeList, 
  events: { event, attendees, loading } 
}) => {
  const classes = useStyles();
  const { id } = useParams();
  const [searchTerm, setSearchTerm] = useState('');
  const [tabValue, setTabValue] = useState(0);
  
  useEffect(() => {
    getEventAttendees(id);
  }, [getEventAttendees, id]);
  
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };
  
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };
  
  const handleExportAttendees = () => {
    exportAttendeeList(id);
  };
  
  const handleEmailAttendees = () => {
    // This would typically open a modal or navigate to an email composition page
    alert('Email functionality would be implemented here');
  };
  
  const filterAttendees = (attendeeList) => {
    if (!searchTerm) return attendeeList;
    
    return attendeeList.filter(attendee => 
      attendee.user.firstName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.user.lastName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.user.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
      attendee.orderNumber.toLowerCase().includes(searchTerm.toLowerCase())
    );
  };
  
  if (loading || !attendees) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  const allAttendees = attendees || [];
  const checkedInAttendees = allAttendees.filter(a => a.checkedIn);
  const notCheckedInAttendees = allAttendees.filter(a => !a.checkedIn);
  
  const filteredAll = filterAttendees(allAttendees);
  const filteredCheckedIn = filterAttendees(checkedInAttendees);
  const filteredNotCheckedIn = filterAttendees(notCheckedInAttendees);
  
  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        {event ? `Attendees: ${event.title}` : 'Event Attendees'}
      </Typography>
      
      <Paper className={classes.paper}>
        <Box className={classes.actionButtons}>
          <Button
            variant="contained"
            color="primary"
            startIcon={<Mail />}
            onClick={handleEmailAttendees}
          >
            Email Attendees
          </Button>
          <Button
            variant="outlined"
            color="primary"
            startIcon={<GetApp />}
            className={classes.exportButton}
            onClick={handleExportAttendees}
          >
            Export List
          </Button>
        </Box>
        
        <TextField
          className={classes.searchField}
          variant="outlined"
          fullWidth
          placeholder="Search attendees by name, email, or order number"
          value={searchTerm}
          onChange={handleSearchChange}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <Search />
              </InputAdornment>
            ),
          }}
        />
        
        <Tabs
          value={tabValue}
          onChange={handleTabChange}
          indicatorColor="primary"
          textColor="primary"
          variant="fullWidth"
        >
          <Tab label={`All (${allAttendees.length})`} />
          <Tab label={`Checked In (${checkedInAttendees.length})`} />
          <Tab label={`Not Checked In (${notCheckedInAttendees.length})`} />
        </Tabs>
        
        <TabPanel value={tabValue} index={0}>
          {filteredAll.length > 0 ? (
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ticket Type</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Status</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredAll.map((attendee) => (
                    <TableRow key={attendee._id}>
                      <TableCell>
                        {`${attendee.user.firstName} ${attendee.user.lastName}`}
                      </TableCell>
                      <TableCell>{attendee.user.email}</TableCell>
                      <TableCell>{attendee.ticketType}</TableCell>
                      <TableCell>{attendee.orderNumber}</TableCell>
                      <TableCell>
                        {new Date(attendee.purchaseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        <Box 
                          component="span" 
                          px={1.5} 
                          py={0.5} 
                          borderRadius={4} 
                          bgcolor={attendee.checkedIn ? 'success.light' : 'warning.light'}
                          color={attendee.checkedIn ? 'success.contrastText' : 'warning.contrastText'}
                        >
                          {attendee.checkedIn ? 'Checked In' : 'Not Checked In'}
                        </Box>
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.emptyMessage}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Attendees Found
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {searchTerm ? 'No attendees match your search criteria.' : 'There are no attendees for this event yet.'}
              </Typography>
            </div>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={1}>
          {filteredCheckedIn.length > 0 ? (
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ticket Type</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Purchase Date</TableCell>
                    <TableCell>Check-in Time</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredCheckedIn.map((attendee) => (
                    <TableRow key={attendee._id}>
                      <TableCell>
                        {`${attendee.user.firstName} ${attendee.user.lastName}`}
                      </TableCell>
                      <TableCell>{attendee.user.email}</TableCell>
                      <TableCell>{attendee.ticketType}</TableCell>
                      <TableCell>{attendee.orderNumber}</TableCell>
                      <TableCell>
                        {new Date(attendee.purchaseDate).toLocaleDateString()}
                      </TableCell>
                      <TableCell>
                        {attendee.checkInTime ? new Date(attendee.checkInTime).toLocaleString() : 'N/A'}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.emptyMessage}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Checked-In Attendees
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {searchTerm ? 'No checked-in attendees match your search criteria.' : 'No attendees have checked in yet.'}
              </Typography>
            </div>
          )}
        </TabPanel>
        
        <TabPanel value={tabValue} index={2}>
          {filteredNotCheckedIn.length > 0 ? (
            <TableContainer className={classes.tableContainer}>
              <Table>
                <TableHead>
                  <TableRow>
                    <TableCell>Name</TableCell>
                    <TableCell>Email</TableCell>
                    <TableCell>Ticket Type</TableCell>
                    <TableCell>Order Number</TableCell>
                    <TableCell>Purchase Date</TableCell>
                  </TableRow>
                </TableHead>
                <TableBody>
                  {filteredNotCheckedIn.map((attendee) => (
                    <TableRow key={attendee._id}>
                      <TableCell>
                        {`${attendee.user.firstName} ${attendee.user.lastName}`}
                      </TableCell>
                      <TableCell>{attendee.user.email}</TableCell>
                      <TableCell>{attendee.ticketType}</TableCell>
                      <TableCell>{attendee.orderNumber}</TableCell>
                      <TableCell>
                        {new Date(attendee.purchaseDate).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </TableContainer>
          ) : (
            <div className={classes.emptyMessage}>
              <Typography variant="h6" color="textSecondary" gutterBottom>
                No Pending Attendees
              </Typography>
              <Typography variant="body1" color="textSecondary">
                {searchTerm ? 'No pending attendees match your search criteria.' : 'All attendees have checked in.'}
              </Typography>
            </div>
          )}
        </TabPanel>
      </Paper>
    </Container>
  );
};

OrganizerAttendees.propTypes = {
  getEventAttendees: PropTypes.func.isRequired,
  exportAttendeeList: PropTypes.func.isRequired,
  events: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  events: state.events
});

export default connect(mapStateToProps, { getEventAttendees, exportAttendeeList })(OrganizerAttendees);
