import React from 'react';
import { Navigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

const OrganizerRoute = ({
  component: Component,
  auth: { isAuthenticated, loading, user },
  ...rest
}) => {
  if (loading) {
    return <div>Loading...</div>;
  }
  
  if (isAuthenticated && user && user.role === 'organizer') {
    return <Component {...rest} />;
  }
  
  return <Navigate to="/login" />;
};

OrganizerRoute.propTypes = {
  auth: PropTypes.object.isRequired,
  component: PropTypes.elementType.isRequired,
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps)(OrganizerRoute);