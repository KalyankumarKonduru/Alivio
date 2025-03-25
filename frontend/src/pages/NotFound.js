import React from 'react';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Button,
  Box,
  makeStyles
} from '@material-ui/core';
import { SentimentDissatisfied } from '@material-ui/icons';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(8),
    marginBottom: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    textAlign: 'center',
  },
  icon: {
    fontSize: 80,
    color: theme.palette.text.secondary,
    marginBottom: theme.spacing(2),
  },
  title: {
    marginBottom: theme.spacing(2),
  },
  subtitle: {
    marginBottom: theme.spacing(4),
    maxWidth: 600,
  },
  button: {
    margin: theme.spacing(1),
  },
}));

const NotFound = () => {
  const classes = useStyles();

  return (
    <Container className={classes.container}>
      <SentimentDissatisfied className={classes.icon} />
      <Typography variant="h3" className={classes.title}>
        404 - Page Not Found
      </Typography>
      <Typography variant="h6" className={classes.subtitle} color="textSecondary">
        The page you are looking for might have been removed, had its name changed, or is temporarily unavailable.
      </Typography>
      <Box>
        <Button
          variant="contained"
          color="primary"
          className={classes.button}
          component={Link}
          to="/"
        >
          Go to Homepage
        </Button>
        <Button
          variant="outlined"
          color="primary"
          className={classes.button}
          component={Link}
          to="/events"
        >
          Browse Events
        </Button>
      </Box>
    </Container>
  );
};

export default NotFound;
