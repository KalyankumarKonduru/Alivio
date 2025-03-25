import React, { useState } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { Navigate, useNavigate } from 'react-router-dom';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Stepper,
  Step,
  StepLabel,
  Button,
  TextField,
  FormControl,
  FormLabel,
  RadioGroup,
  FormControlLabel,
  Radio,
  Divider,
  Box,
  Card,
  CardContent,
  makeStyles
} from '@material-ui/core';
import {
  Payment as PaymentIcon,
  CheckCircle,
  EventNote
} from '@material-ui/icons';
import { Elements, CardElement, useStripe, useElements } from '@stripe/react-stripe-js';
import { loadStripe } from '@stripe/stripe-js';
import { createOrder } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';

// Load Stripe
const stripePromise = loadStripe('pk_test_your_stripe_publishable_key');

const useStyles = makeStyles((theme) => ({
  checkoutContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
  },
  total: {
    fontWeight: 'bold',
  },
  cardElement: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
  },
  paymentSuccess: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  successIcon: {
    fontSize: '4rem',
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
}));

const steps = ['Shipping address', 'Payment details', 'Review your order'];

// Address Form Component
const AddressForm = ({ formData, setFormData }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Shipping address
      </Typography>
      <Grid container spacing={3}>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="firstName"
            name="firstName"
            label="First name"
            fullWidth
            autoComplete="given-name"
            value={formData.firstName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="lastName"
            name="lastName"
            label="Last name"
            fullWidth
            autoComplete="family-name"
            value={formData.lastName}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            required
            id="address1"
            name="address1"
            label="Address line 1"
            fullWidth
            autoComplete="shipping address-line1"
            value={formData.address1}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12}>
          <TextField
            id="address2"
            name="address2"
            label="Address line 2"
            fullWidth
            autoComplete="shipping address-line2"
            value={formData.address2}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="city"
            name="city"
            label="City"
            fullWidth
            autoComplete="shipping address-level2"
            value={formData.city}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            id="state"
            name="state"
            label="State/Province/Region"
            fullWidth
            value={formData.state}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="zip"
            name="zip"
            label="Zip / Postal code"
            fullWidth
            autoComplete="shipping postal-code"
            value={formData.zip}
            onChange={handleChange}
          />
        </Grid>
        <Grid item xs={12} sm={6}>
          <TextField
            required
            id="country"
            name="country"
            label="Country"
            fullWidth
            autoComplete="shipping country"
            value={formData.country}
            onChange={handleChange}
          />
        </Grid>
      </Grid>
    </>
  );
};

// Payment Form Component
const PaymentForm = ({ classes }) => {
  return (
    <>
      <Typography variant="h6" gutterBottom>
        Payment method
      </Typography>
      <FormControl component="fieldset">
        <FormLabel component="legend">Select payment method</FormLabel>
        <RadioGroup aria-label="payment-method" name="paymentMethod" value="credit">
          <FormControlLabel
            value="credit"
            control={<Radio color="primary" />}
            label="Credit / Debit Card"
          />
        </RadioGroup>
      </FormControl>
      <div className={classes.cardElement}>
        <CardElement
          options={{
            style: {
              base: {
                fontSize: '16px',
                color: '#424770',
                '::placeholder': {
                  color: '#aab7c4',
                },
              },
              invalid: {
                color: '#9e2146',
              },
            },
          }}
        />
      </div>
    </>
  );
};

// Review Component
const Review = ({ cartItems }) => {
  const classes = useStyles();
  
  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  return (
    <>
      <Typography variant="h6" gutterBottom>
        Order summary
      </Typography>
      <List>
        {cartItems.map((item) => (
          <div key={item.ticket}>
            <div className={classes.summaryItem}>
              <div>
                <Typography variant="body1">{item.eventTitle}</Typography>
                <Typography variant="body2" color="textSecondary">
                  {item.ticketType} x {item.quantity}
                </Typography>
              </div>
              <Typography variant="body1">${item.subtotal.toFixed(2)}</Typography>
            </div>
            <Divider className={classes.divider} />
          </div>
        ))}
        <div className={classes.summaryItem}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </div>
        <div className={classes.summaryItem}>
          <Typography variant="body1">Service Fee</Typography>
          <Typography variant="body1">${serviceFee.toFixed(2)}</Typography>
        </div>
        <Divider className={classes.divider} />
        <div className={classes.summaryItem}>
          <Typography variant="h6" className={classes.total}>Total</Typography>
          <Typography variant="h6" className={classes.total}>${total.toFixed(2)}</Typography>
        </div>
      </List>
    </>
  );
};

// List Component for Review
const List = ({ children }) => (
  <div>
    {children}
  </div>
);

// Checkout Form Component
const CheckoutForm = ({ cartItems, createOrder, clearCart, user }) => {
  const classes = useStyles();
  const [activeStep, setActiveStep] = useState(0);
  const [formData, setFormData] = useState({
    firstName: user ? user.firstName : '',
    lastName: user ? user.lastName : '',
    address1: '',
    address2: '',
    city: '',
    state: '',
    zip: '',
    country: '',
  });
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);
  const [processing, setProcessing] = useState(false);
  const [error, setError] = useState(null);
  
  const history = useNavigate();
  const stripe = useStripe();
  const elements = useElements();

  const handleNext = async () => {
    if (activeStep === steps.length - 1) {
      // Submit payment
      setProcessing(true);
      setError(null);
      
      if (!stripe || !elements) {
        setError("Stripe hasn't loaded yet. Please try again.");
        setProcessing(false);
        return;
      }
      
      const cardElement = elements.getElement(CardElement);
      
      // Create payment method
      const { error, paymentMethod } = await stripe.createPaymentMethod({
        type: 'card',
        card: cardElement,
      });
      
      if (error) {
        setError(error.message);
        setProcessing(false);
        return;
      }
      
      // Calculate totals
      const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
      const serviceFee = subtotal * 0.1;
      const total = subtotal + serviceFee;
      
      // Create order
      try {
        const orderData = {
          paymentIntentId: paymentMethod.id,
          items: cartItems.map(item => ({
            ticket: item.ticket,
            event: item.event,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          })),
          shippingAddress: formData,
          totalAmount: total
        };
        
        const response = await createOrder(orderData);
        setOrderId(response._id);
        clearCart();
        setPaymentSuccess(true);
      } catch (err) {
        setError("There was an error processing your payment. Please try again.");
      }
      
      setProcessing(false);
    } else {
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // If payment was successful, show success message
  if (paymentSuccess) {
    return (
      <div className={classes.paymentSuccess}>
        <CheckCircle className={classes.successIcon} />
        <Typography variant="h5" gutterBottom>
          Thank you for your order!
        </Typography>
        <Typography variant="subtitle1">
          Your order has been placed successfully. Your order number is #{orderId}.
        </Typography>
        <Typography variant="body1" paragraph>
          We have emailed your order confirmation, and will send you an update when your order has shipped.
        </Typography>
        <Button
          variant="contained"
          color="primary"
          startIcon={<EventNote />}
          onClick={() => history.push('/')}
        >
          Continue Shopping
        </Button>
      </div>
    );
  }

  return (
    <>
      <Stepper activeStep={activeStep} className={classes.stepper}>
        {steps.map((label) => (
          <Step key={label}>
            <StepLabel>{label}</StepLabel>
          </Step>
        ))}
      </Stepper>
      <>
        {activeStep === 0 && (
          <AddressForm formData={formData} setFormData={setFormData} />
        )}
        {activeStep === 1 && (
          <PaymentForm classes={classes} />
        )}
        {activeStep === 2 && (
          <Review cartItems={cartItems} />
        )}
        {error && (
          <Typography color="error" style={{ marginTop: '16px' }}>
            {error}
          </Typography>
        )}
        <div className={classes.buttons}>
          {activeStep !== 0 && (
            <Button onClick={handleBack} className={classes.button}>
              Back
            </Button>
          )}
          <Button
            variant="contained"
            color="primary"
            onClick={handleNext}
            className={classes.button}
            disabled={processing}
            startIcon={activeStep === steps.length - 1 ? <PaymentIcon /> : null}
          >
            {activeStep === steps.length - 1 ? 'Place order' : 'Next'}
          </Button>
        </div>
      </>
    </>
  );
};

const Checkout = ({ cart: { cartItems }, auth: { user }, createOrder, clearCart }) => {
  const classes = useStyles();
  const history = useNavigate();

  // Redirect to cart if cart is empty
  if (cartItems.length === 0) {
    history.push('/cart');
    return null;
  }

  return (
    <Container className={classes.checkoutContainer}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Paper className={classes.paper}>
        <Elements stripe={stripePromise}>
          <CheckoutForm 
            cartItems={cartItems} 
            createOrder={createOrder} 
            clearCart={clearCart}
            user={user}
          />
        </Elements>
      </Paper>
    </Container>
  );
};

Checkout.propTypes = {
  cart: PropTypes.object.isRequired,
  auth: PropTypes.object.isRequired,
  createOrder: PropTypes.func.isRequired,
  clearCart: PropTypes.func.isRequired,
};

const mapStateToProps = (state) => ({
  cart: state.cart,
  auth: state.auth,
});

export default connect(mapStateToProps, { createOrder, clearCart })(Checkout);
