import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  TextField,
  Button,
  Avatar,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Edit, Save, Person } from '@material-ui/icons';
import { updateProfile, changePassword } from '../redux/actions/authActions';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
  },
  avatar: {
    width: theme.spacing(12),
    height: theme.spacing(12),
    marginBottom: theme.spacing(2),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  sectionTitle: {
    marginTop: theme.spacing(3),
    marginBottom: theme.spacing(2),
  },
  button: {
    marginTop: theme.spacing(3),
    marginRight: theme.spacing(2),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
}));

const UserProfile = ({ auth: { user, loading }, updateProfile, changePassword }) => {
  const classes = useStyles();
  
  const [profileData, setProfileData] = useState({
    firstName: '',
    lastName: '',
    phoneNumber: '',
    street: '',
    city: '',
    state: '',
    zipCode: '',
    country: ''
  });
  
  const [passwordData, setPasswordData] = useState({
    currentPassword: '',
    newPassword: '',
    confirmPassword: ''
  });
  
  const [editMode, setEditMode] = useState(false);
  const [passwordMode, setPasswordMode] = useState(false);
  const [errors, setErrors] = useState({});
  const [passwordErrors, setPasswordErrors] = useState({});
  const [success, setSuccess] = useState(null);
  
  useEffect(() => {
    if (user) {
      setProfileData({
        firstName: user.firstName || '',
        lastName: user.lastName || '',
        phoneNumber: user.phoneNumber || '',
        street: user.address?.street || '',
        city: user.address?.city || '',
        state: user.address?.state || '',
        zipCode: user.address?.zipCode || '',
        country: user.address?.country || ''
      });
    }
  }, [user]);
  
  const {
    firstName,
    lastName,
    phoneNumber,
    street,
    city,
    state,
    zipCode,
    country
  } = profileData;
  
  const {
    currentPassword,
    newPassword,
    confirmPassword
  } = passwordData;
  
  const onProfileChange = e => {
    setProfileData({ ...profileData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (errors[e.target.name]) {
      setErrors({ ...errors, [e.target.name]: null });
    }
  };
  
  const onPasswordChange = e => {
    setPasswordData({ ...passwordData, [e.target.name]: e.target.value });
    // Clear error when field is edited
    if (passwordErrors[e.target.name]) {
      setPasswordErrors({ ...passwordErrors, [e.target.name]: null });
    }
  };
  
  const validateProfileForm = () => {
    const newErrors = {};
    
    if (!firstName) newErrors.firstName = 'First name is required';
    if (!lastName) newErrors.lastName = 'Last name is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const validatePasswordForm = () => {
    const newErrors = {};
    
    if (!currentPassword) newErrors.currentPassword = 'Current password is required';
    if (!newPassword) newErrors.newPassword = 'New password is required';
    if (newPassword && newPassword.length < 6) newErrors.newPassword = 'Password must be at least 6 characters';
    if (!confirmPassword) newErrors.confirmPassword = 'Please confirm your new password';
    if (newPassword !== confirmPassword) newErrors.confirmPassword = 'Passwords do not match';
    
    setPasswordErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };
  
  const onProfileSubmit = async e => {
    e.preventDefault();
    
    if (validateProfileForm()) {
      // Format data for API
      const userData = {
        firstName,
        lastName,
        phoneNumber,
        address: {
          street,
          city,
          state,
          zipCode,
          country
        }
      };
      
      try {
        await updateProfile(userData);
        setEditMode(false);
        setSuccess('Profile updated successfully');
        setTimeout(() => setSuccess(null), 5000);
      } catch (err) {
        console.error('Error updating profile:', err);
      }
    }
  };
  
  const onPasswordSubmit = async e => {
    e.preventDefault();
    
    if (validatePasswordForm()) {
      try {
        await changePassword({ currentPassword, newPassword });
        setPasswordMode(false);
        setPasswordData({
          currentPassword: '',
          newPassword: '',
          confirmPassword: ''
        });
        setSuccess('Password changed successfully');
        setTimeout(() => setSuccess(null), 5000);
      } catch (err) {
        console.error('Error changing password:', err);
      }
    }
  };
  
  if (loading || !user) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        My Profile
      </Typography>
      
      {success && (
        <Box mb={3} p={2} bgcolor="success.light" color="success.contrastText" borderRadius={4}>
          <Typography variant="body1">{success}</Typography>
        </Box>
      )}
      
      <Paper className={classes.paper}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Avatar className={classes.avatar}>
            {user.profileImage ? (
              <img src={user.profileImage} alt={user.firstName} width="100%" />
            ) : (
              <Person fontSize="large" />
            )}
          </Avatar>
          <Typography variant="h5">
            {user.firstName} {user.lastName}
          </Typography>
          <Typography variant="body1" color="textSecondary">
            {user.email}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            {user.role === 'organizer' ? 'Event Organizer' : 'User'}
          </Typography>
        </Box>
        
        <Divider className={classes.divider} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className={classes.sectionTitle}>
            Personal Information
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            startIcon={editMode ? <Save /> : <Edit />}
            onClick={() => setEditMode(!editMode)}
          >
            {editMode ? 'Cancel' : 'Edit Profile'}
          </Button>
        </Box>
        
        {editMode ? (
          <form onSubmit={onProfileSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12} md={6}>
                <TextField
                  name="firstName"
                  label="First Name"
                  variant="outlined"
                  fullWidth
                  value={firstName}
                  onChange={onProfileChange}
                  error={!!errors.firstName}
                  helperText={errors.firstName}
                  required
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="lastName"
                  label="Last Name"
                  variant="outlined"
                  fullWidth
                  value={lastName}
                  onChange={onProfileChange}
                  error={!!errors.lastName}
                  helperText={errors.lastName}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="phoneNumber"
                  label="Phone Number"
                  variant="outlined"
                  fullWidth
                  value={phoneNumber}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Typography variant="subtitle1" gutterBottom>
                  Address Information
                </Typography>
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="street"
                  label="Street Address"
                  variant="outlined"
                  fullWidth
                  value={street}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="city"
                  label="City"
                  variant="outlined"
                  fullWidth
                  value={city}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="state"
                  label="State/Province"
                  variant="outlined"
                  fullWidth
                  value={state}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="zipCode"
                  label="Zip/Postal Code"
                  variant="outlined"
                  fullWidth
                  value={zipCode}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12} md={6}>
                <TextField
                  name="country"
                  label="Country"
                  variant="outlined"
                  fullWidth
                  value={country}
                  onChange={onProfileChange}
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Save Changes
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <List>
            <ListItem>
              <ListItemText primary="Name" secondary={`${user.firstName} ${user.lastName}`} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Email" secondary={user.email} />
            </ListItem>
            <ListItem>
              <ListItemText primary="Phone" secondary={user.phoneNumber || 'Not provided'} />
            </ListItem>
            <ListItem>
              <ListItemText 
                primary="Address" 
                secondary={
                  user.address?.street
                    ? `${user.address.street}, ${user.address.city || ''} ${user.address.state || ''} ${user.address.zipCode || ''}, ${user.address.country || ''}`
                    : 'Not provided'
                } 
              />
            </ListItem>
          </List>
        )}
        
        <Divider className={classes.divider} />
        
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <Typography variant="h6" className={classes.sectionTitle}>
            Security
          </Typography>
          <Button
            variant="outlined"
            color="primary"
            onClick={() => setPasswordMode(!passwordMode)}
          >
            {passwordMode ? 'Cancel' : 'Change Password'}
          </Button>
        </Box>
        
        {passwordMode ? (
          <form onSubmit={onPasswordSubmit}>
            <Grid container spacing={3}>
              <Grid item xs={12}>
                <TextField
                  name="currentPassword"
                  label="Current Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={currentPassword}
                  onChange={onPasswordChange}
                  error={!!passwordErrors.currentPassword}
                  helperText={passwordErrors.currentPassword}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="newPassword"
                  label="New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={newPassword}
                  onChange={onPasswordChange}
                  error={!!passwordErrors.newPassword}
                  helperText={passwordErrors.newPassword}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <TextField
                  name="confirmPassword"
                  label="Confirm New Password"
                  type="password"
                  variant="outlined"
                  fullWidth
                  value={confirmPassword}
                  onChange={onPasswordChange}
                  error={!!passwordErrors.confirmPassword}
                  helperText={passwordErrors.confirmPassword}
                  required
                />
              </Grid>
              
              <Grid item xs={12}>
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  className={classes.button}
                >
                  Update Password
                </Button>
              </Grid>
            </Grid>
          </form>
        ) : (
          <Typography variant="body1">
            Password: ••••••••
          </Typography>
        )}
      </Paper>
    </Container>
  );
};

UserProfile.propTypes = {
  auth: PropTypes.object.isRequired,
  updateProfile: PropTypes.func.isRequired,
  changePassword: PropTypes.func.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps, { updateProfile, changePassword })(UserProfile);
