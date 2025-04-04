import React from 'react';
import { Container, Typography, Button, Grid, makeStyles } from '@material-ui/core';
import AddTicketForm from '../components/AddTicketForm';
import axios from 'axios';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  title: {
    marginBottom: theme.spacing(4),
  },
  section: {
    marginTop: theme.spacing(4),
  },
  card: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  button: {
    margin: theme.spacing(1),
  },
  testResults: {
    backgroundColor: '#f5f5f5',
    padding: theme.spacing(2),
    borderRadius: theme.spacing(1),
    marginTop: theme.spacing(2),
    whiteSpace: 'pre-wrap',
    fontSize: '0.9em',
  },
}));

const TestTicket = () => {
  const classes = useStyles();
  const [testResults, setTestResults] = React.useState('');
  const [loading, setLoading] = React.useState(false);

  const testApi = async () => {
    setLoading(true);
    setTestResults('Testing API...');
    
    try {
      // Test event exists
      const eventId = '67ef428399a428d2bac9547d';
      const eventResponse = await axios.get(`/api/events/${eventId}`);
      
      // Test tickets for event
      const ticketResponse = await axios.get(`/api/tickets/event/${eventId}`);
      
      const results = `API Test Results:

Event API:
- Status: ${eventResponse.status}
- Event Found: ${eventResponse.data.success}
- Event Title: ${eventResponse.data.data?.title || 'Not found'}

Ticket API:
- Status: ${ticketResponse.status}
- Success: ${ticketResponse.data.success}
- Tickets Found: ${ticketResponse.data.count}
- Tickets: ${JSON.stringify(ticketResponse.data.data, null, 2)}

Debug Info: ${JSON.stringify(ticketResponse.data.debug || {}, null, 2)}
`;
      
      setTestResults(results);
    } catch (error) {
      console.error('API test error:', error);
      setTestResults(`Error testing API:
Status: ${error.response?.status || 'Unknown'}
Message: ${error.response?.data?.message || error.message}
`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container className={classes.container}>
      <Typography variant="h4" component="h1" className={classes.title}>
        Ticket Testing Tool
      </Typography>
      
      <Typography variant="body1" paragraph>
        Use this page to test and debug ticket functionality. This will help ensure that tickets are properly connected to events.
      </Typography>
      
      <Grid container spacing={4}>
        <Grid item xs={12}>
          <Typography variant="h5" className={classes.section}>
            1. Test API Endpoints
          </Typography>
          
          <Button 
            variant="contained" 
            color="primary" 
            onClick={testApi}
            disabled={loading}
            className={classes.button}
          >
            {loading ? 'Testing...' : 'Test API Endpoints'}
          </Button>
          
          {testResults && (
            <pre className={classes.testResults}>
              {testResults}
            </pre>
          )}
        </Grid>
        
        <Grid item xs={12}>
          <Typography variant="h5" className={classes.section}>
            2. Add New Test Ticket
          </Typography>
          
          <AddTicketForm />
        </Grid>
      </Grid>
    </Container>
  );
};

export default TestTicket;