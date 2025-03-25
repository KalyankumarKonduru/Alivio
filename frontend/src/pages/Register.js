import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { 
  Container, 
  Typography, 
  TextField, 
  Button, 
  Grid, 
  Paper, 
  Avatar, 
  FormControl, 
  FormControlLabel, 
  RadioGroup, 
  Radio,
  makeStyles 
} from '@material-ui/core';
import { LockOutlined } from '@material-ui/icons';
import { Link, Navigate } from 'react-router-dom';
import { register } from '../redux/actions/authActions';

const useStyles = makeStyles((theme) => ({
  paper: {
    marginTop: theme.spacing(8),
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: theme.spacing(4),
  },
  avatar: {
    margin: theme.spacing(1),
    backgroundColor: theme.palette.secondary.main,
  },
  form: {
    width: '100%',
    marginTop: theme.spacing(3),
  },
  submit: {
    margin: theme.spacing(3, 0, 2),
  },
  roleSelector: {
    marginTop: theme.spacing(2),
    marginBottom: theme.spacing(2),
  },
  loginLink: {
    marginTop: theme.spacing(2),
    display: 'flex',
    justifyContent: 'center',
  },
}));

const Register = ({ register, isAuthenticated, user }) => {
  const classes = useStyles();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    password2: '',
    role: 'user',
    phoneNumber: '',
    address: '',
  });

  const { firstName, lastName, email, password, password2, role, phoneNumber, address } = formData;

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  console.log('Submitting:', { firstName, lastName, email, password, role, phoneNumber, address });
  const onSubmit = (e) => {
    e.preventDefault();
    
    console.log('Submitting:', { firstName, lastName, email, password, password2, role, phoneNumber, address });
    if (password !== password2) {
      // Handle password mismatch error
      console.error('Passwords do not match');
    } else {
      register({ firstName, lastName, email, password, role, phoneNumber, address});
    }
  };

  // Redirect if logged in
  if (isAuthenticated) {
    if (user && user.role === 'organizer') {
      return <Navigate to="/organizer" />;
    }
    return <Navigate to="/" />;
  }

  return (
    <Container component="main" maxWidth="xs">
      <Paper className={classes.paper} elevation={3}>
        <Avatar className={classes.avatar}>
          <LockOutlined />
        </Avatar>
        <Typography component="h1" variant="h5">
          Register
        </Typography>
        <form className={classes.form} onSubmit={onSubmit}>
          <Grid container spacing={2}>
            <Grid item xs={12} sm={6}>
              <TextField
                autoComplete="fname"
                name="firstName"
                variant="outlined"
                required
                fullWidth
                id="firstName"
                label="First Name"
                value={firstName}
                onChange={onChange}
                autoFocus
              />
            </Grid>
            <Grid item xs={12} sm={6}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="lastName"
                label="Last Name"
                name="lastName"
                autoComplete="lname"
                value={lastName}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                id="email"
                label="Email Address"
                name="email"
                autoComplete="email"
                value={email}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password"
                label="Password"
                type="password"
                id="password"
                autoComplete="new-password"
                value={password}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
                  <TextField
                  variant="outlined"
                  fullWidth
                  label="Phone Number"
                  name="phoneNumber"
                  value={phoneNumber}
                  onChange={onChange}
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  variant="outlined"
                  fullWidth
                  label="Address"
                  name="address"
                  value={address}
                  onChange={onChange}
                />
              </Grid>
            <Grid item xs={12}>
              <TextField
                variant="outlined"
                required
                fullWidth
                name="password2"
                label="Confirm Password"
                type="password"
                id="password2"
                value={password2}
                onChange={onChange}
              />
            </Grid>
            <Grid item xs={12}>
              <FormControl component="fieldset" className={classes.roleSelector}>
                <Typography variant="subtitle1" gutterBottom>
                  Register as:
                </Typography>
                <RadioGroup
                  aria-label="role"
                  name="role"
                  value={role}
                  onChange={onChange}
                  row
                >
                  <FormControlLabel
                    value="user"
                    control={<Radio color="primary" />}
                    label="User"
                  />
                  <FormControlLabel
                    value="organizer"
                    control={<Radio color="primary" />}
                    label="Event Organizer"
                  />
                </RadioGroup>
              </FormControl>
            </Grid>
          </Grid>
          <Button
            type="submit"
            fullWidth
            variant="contained"
            color="primary"
            className={classes.submit}
          >
            Register
          </Button>
          <Grid container justifyContent="flex-end">
            <Grid item className={classes.loginLink}>
              <Link to="/login" variant="body2">
                Already have an account? Sign in
              </Link>
            </Grid>
          </Grid>
        </form>
      </Paper>
    </Container>
  );
};

Register.propTypes = {
  register: PropTypes.func.isRequired,
  isAuthenticated: PropTypes.bool,
  user: PropTypes.object,
};

const mapStateToProps = (state) => ({
  isAuthenticated: state.auth.isAuthenticated,
  user: state.auth.user,
});

export default connect(mapStateToProps, { register })(Register);
