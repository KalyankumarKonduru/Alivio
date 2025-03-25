import React from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Link } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  IconButton,
  Divider,
  Box,
  Paper,
  makeStyles
} from '@material-ui/core';
import {
  Delete,
  Add,
  Remove,
  ShoppingCart,
  EventNote
} from '@material-ui/icons';
import { removeFromCart, updateCartQuantity } from '../redux/actions/cartActions';

const useStyles = makeStyles((theme) => ({
  cartContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  cartTitle: {
    marginBottom: theme.spacing(4),
  },
  cartItem: {
    marginBottom: theme.spacing(2),
  },
  itemDetails: {
    display: 'flex',
    justifyContent: 'space-between',
    alignItems: 'center',
    [theme.breakpoints.down('xs')]: {
      flexDirection: 'column',
      alignItems: 'flex-start',
    },
  },
  itemTitle: {
    fontWeight: 'bold',
  },
  quantityControl: {
    display: 'flex',
    alignItems: 'center',
    marginTop: theme.spacing(1),
  },
  quantity: {
    margin: theme.spacing(0, 2),
  },
  price: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  summaryCard: {
    position: 'sticky',
    top: theme.spacing(2),
  },
  summaryTitle: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(2),
  },
  summaryRow: {
    display: 'flex',
    justifyContent: 'space-between',
    marginBottom: theme.spacing(1),
  },
  totalRow: {
    display: 'flex',
    justifyContent: 'space-between',
    fontWeight: 'bold',
    fontSize: '1.2rem',
    marginTop: theme.spacing(2),
    paddingTop: theme.spacing(2),
    borderTop: `1px solid ${theme.palette.divider}`,
  },
  checkoutButton: {
    marginTop: theme.spacing(3),
  },
  emptyCart: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  emptyCartIcon: {
    fontSize: '4rem',
    color: theme.palette.grey[400],
    marginBottom: theme.spacing(2),
  },
}));

const Cart = ({ cart: { cartItems }, removeFromCart, updateCartQuantity }) => {
  const classes = useStyles();

  const handleRemoveFromCart = (ticketId) => {
    removeFromCart(ticketId);
  };

  const handleUpdateQuantity = (ticketId, quantity, currentQuantity) => {
    const newQuantity = currentQuantity + quantity;
    if (newQuantity > 0) {
      updateCartQuantity(ticketId, newQuantity);
    }
  };

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString(undefined, options);
  };

  return (
    <Container className={classes.cartContainer}>
      <Typography variant="h4" component="h1" className={classes.cartTitle}>
        Your Cart
      </Typography>

      {cartItems.length === 0 ? (
        <Paper className={classes.emptyCart}>
          <ShoppingCart className={classes.emptyCartIcon} />
          <Typography variant="h5" gutterBottom>
            Your cart is empty
          </Typography>
          <Typography variant="body1" paragraph>
            Looks like you haven't added any tickets to your cart yet.
          </Typography>
          <Button
            component={Link}
            to="/"
            variant="contained"
            color="primary"
            startIcon={<EventNote />}
          >
            Browse Events
          </Button>
        </Paper>
      ) : (
        <Grid container spacing={4}>
          <Grid item xs={12} md={8}>
            {cartItems.map((item) => (
              <Card key={item.ticket} className={classes.cartItem}>
                <CardContent>
                  <div className={classes.itemDetails}>
                    <div>
                      <Typography variant="h6" className={classes.itemTitle}>
                        {item.eventTitle}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {formatDate(item.date)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        {item.venue}
                      </Typography>
                      <Typography variant="body2">
                        Ticket Type: {item.ticketType}
                      </Typography>
                      <div className={classes.quantityControl}>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.ticket, -1, item.quantity)}
                        >
                          <Remove />
                        </IconButton>
                        <Typography variant="body1" className={classes.quantity}>
                          {item.quantity}
                        </Typography>
                        <IconButton
                          size="small"
                          onClick={() => handleUpdateQuantity(item.ticket, 1, item.quantity)}
                        >
                          <Add />
                        </IconButton>
                      </div>
                    </div>
                    <div>
                      <Typography variant="h6" className={classes.price}>
                        ${item.subtotal.toFixed(2)}
                      </Typography>
                      <Typography variant="body2" color="textSecondary">
                        ${item.price.toFixed(2)} each
                      </Typography>
                      <IconButton
                        color="secondary"
                        onClick={() => handleRemoveFromCart(item.ticket)}
                      >
                        <Delete />
                      </IconButton>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} md={4}>
            <Paper className={classes.summaryCard} elevation={3}>
              <CardContent>
                <Typography variant="h6" className={classes.summaryTitle}>
                  Order Summary
                </Typography>
                <div className={classes.summaryRow}>
                  <Typography variant="body1">Subtotal</Typography>
                  <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
                </div>
                <div className={classes.summaryRow}>
                  <Typography variant="body1">Service Fee</Typography>
                  <Typography variant="body1">${serviceFee.toFixed(2)}</Typography>
                </div>
                <div className={classes.totalRow}>
                  <Typography variant="body1">Total</Typography>
                  <Typography variant="body1">${total.toFixed(2)}</Typography>
                </div>
                <Button
                  component={Link}
                  to="/checkout"
                  variant="contained"
                  color="primary"
                  fullWidth
                  size="large"
                  className={classes.checkoutButton}
                >
                  Proceed to Checkout
                </Button>
              </CardContent>
            </Paper>
          </Grid>
        </Grid>
      )}
    </Container>
  );
};

Cart.propTypes = {
  cart: PropTypes.object.isRequired,
  removeFromCart: PropTypes.func.isRequired,
  updateCartQuantity: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
});

export default connect(mapStateToProps, { removeFromCart, updateCartQuantity })(Cart);
