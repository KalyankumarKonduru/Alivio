import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { makeStyles } from '@material-ui/core/styles';
import { Alert as MuiAlert } from '@material-ui/lab';
import { Snackbar } from '@material-ui/core';

const useStyles = makeStyles((theme) => ({
  root: {
    width: '100%',
    '& > * + *': {
      marginTop: theme.spacing(2),
    },
  },
}));

const Alert = ({ alerts }) => {
  const classes = useStyles();

  return (
    <div className={classes.root}>
      {alerts !== null &&
        alerts.length > 0 &&
        alerts.map((alert) => (
          <Snackbar 
            key={alert.id} 
            open={true} 
            anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
          >
            <MuiAlert 
              elevation={6} 
              variant="filled" 
              severity={alert.alertType}
            >
              {alert.msg}
            </MuiAlert>
          </Snackbar>
        ))}
    </div>
  );
};

Alert.propTypes = {
  alerts: PropTypes.array.isRequired,
};

const mapStateToProps = (state) => ({
  alerts: state.alerts,
});

export default connect(mapStateToProps)(Alert);
