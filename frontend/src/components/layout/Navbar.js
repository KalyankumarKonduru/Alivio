import React from 'react';
import { Link } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Button, IconButton, Badge, Menu, MenuItem, makeStyles } from '@material-ui/core';
import { ShoppingCart, AccountCircle, ExitToApp, Dashboard } from '@material-ui/icons';
import { logout } from '../../redux/actions/authActions';

const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
  },
  title: {
    flexGrow: 1,
    textDecoration: 'none',
    color: 'white',
    fontWeight: 'bold',
    fontSize: '1.5rem',
  },
  navLink: {
    color: 'white',
    textDecoration: 'none',
    marginLeft: theme.spacing(2),
  },
  navButton: {
    marginLeft: theme.spacing(1),
  },
  cartIcon: {
    marginRight: theme.spacing(2),
  },
}));

const Navbar = ({ auth: { isAuthenticated, loading, user }, logout, cart: { cartItems } }) => {
  const classes = useStyles();
  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const authLinks = (
    <>
      <IconButton 
        component={Link} 
        to="/cart" 
        color="inherit" 
        className={classes.cartIcon}
      >
        <Badge badgeContent={cartItems.length} color="secondary">
          <ShoppingCart />
        </Badge>
      </IconButton>
      <IconButton
        aria-label="account of current user"
        aria-controls="menu-appbar"
        aria-haspopup="true"
        onClick={handleMenu}
        color="inherit"
      >
        <AccountCircle />
      </IconButton>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        keepMounted
        transformOrigin={{
          vertical: 'top',
          horizontal: 'right',
        }}
        open={open}
        onClose={handleClose}
      >
        {user && user.role === 'organizer' && (
          <MenuItem component={Link} to="/organizer" onClick={handleClose}>
            <Dashboard fontSize="small" style={{ marginRight: '8px' }} />
            Organizer Dashboard
          </MenuItem>
        )}
        <MenuItem component={Link} to="/profile" onClick={handleClose}>Profile</MenuItem>
        <MenuItem component={Link} to="/orders" onClick={handleClose}>My Orders</MenuItem>
        <MenuItem onClick={() => {
          handleClose();
          logout();
        }}>
          <ExitToApp fontSize="small" style={{ marginRight: '8px' }} />
          Logout
        </MenuItem>
      </Menu>
    </>
  );

  const guestLinks = (
    <>
      <Button 
        component={Link} 
        to="/login" 
        color="inherit" 
        className={classes.navButton}
      >
        Login
      </Button>
      <Button 
        component={Link} 
        to="/register" 
        color="inherit" 
        variant="outlined" 
        className={classes.navButton}
      >
        Register
      </Button>
    </>
  );

  return (
    <div className={classes.root}>
      <AppBar position="static">
        <Toolbar>
          <Typography 
            variant="h6" 
            component={Link} 
            to="/" 
            className={classes.title}
          >
            Alivio
          </Typography>
          <Button component={Link} to="/" color="inherit">
            Events
          </Button>
          {!loading && (isAuthenticated ? authLinks : guestLinks)}
        </Toolbar>
      </AppBar>
    </div>
  );
};

Navbar.propTypes = {
  logout: PropTypes.func.isRequired,
  auth: PropTypes.object.isRequired,
  cart: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth,
  cart: state.cart
});

export default connect(mapStateToProps, { logout })(Navbar);
