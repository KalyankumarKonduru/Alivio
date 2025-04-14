import React, { useState, useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import { useNavigate } from 'react-router-dom';
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
  CircularProgress,
  Fade,
  makeStyles
} from '@material-ui/core';
import {
  Payment as PaymentIcon,
  CheckCircle,
  ArrowBack,
  ArrowForward,
  LocalShipping,
  Receipt,
  CreditCard,
  AccountBalance
} from '@material-ui/icons';
import { green } from '@material-ui/core/colors';
import { createOrder } from '../redux/actions/orderActions';
import { clearCart } from '../redux/actions/cartActions';

const useStyles = makeStyles((theme) => ({
  checkoutContainer: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
    animation: '$fadeIn 0.8s ease-out',
  },
  paper: {
    padding: theme.spacing(3),
    marginBottom: theme.spacing(3),
    transition: 'box-shadow 0.3s ease-in-out',
    '&:hover': {
      boxShadow: theme.shadows[4],
    },
  },
  stepper: {
    padding: theme.spacing(3, 0, 5),
    backgroundColor: 'transparent',
  },
  stepIcon: {
    backgroundColor: theme.palette.primary.main,
    color: theme.palette.common.white,
    borderRadius: '50%',
    width: 36,
    height: 36,
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    fontSize: 18,
    transition: 'transform 0.2s ease',
    '&:hover': {
      transform: 'scale(1.1)',
    },
  },
  activeStepIcon: {
    backgroundColor: theme.palette.secondary.main,
    boxShadow: `0 0 0 2px ${theme.palette.secondary.light}`,
  },
  completedStepIcon: {
    backgroundColor: green[500],
  },
  buttons: {
    display: 'flex',
    justifyContent: 'flex-end',
    marginTop: theme.spacing(3),
  },
  button: {
    marginTop: theme.spacing(3),
    marginLeft: theme.spacing(1),
    transition: 'all 0.2s ease',
    '&:hover': {
      transform: 'translateY(-2px)',
      boxShadow: theme.shadows[2],
    },
    '&:active': {
      transform: 'translateY(1px)',
    },
  },
  divider: {
    margin: theme.spacing(2, 0),
  },
  summaryItem: {
    display: 'flex',
    justifyContent: 'space-between',
    padding: theme.spacing(1, 0),
    transition: 'background-color 0.2s ease',
    '&:hover': {
      backgroundColor: 'rgba(0, 0, 0, 0.02)',
    },
  },
  total: {
    fontWeight: 'bold',
    color: theme.palette.primary.main,
  },
  paymentForm: {
    marginTop: theme.spacing(2),
  },
  paymentMethod: {
    border: `1px solid ${theme.palette.divider}`,
    padding: theme.spacing(2),
    borderRadius: theme.shape.borderRadius,
    marginTop: theme.spacing(2),
    transition: 'all 0.3s ease',
    backgroundColor: '#fafafa',
  },
  paymentMethodSelected: {
    borderColor: theme.palette.primary.main,
    boxShadow: `0 0 0 2px ${theme.palette.primary.light}`,
    transform: 'scale(1.01)',
  },
  paymentIcon: {
    marginRight: theme.spacing(1),
  },
  paymentDetails: {
    padding: theme.spacing(2),
    marginTop: theme.spacing(2),
    backgroundColor: '#f5f5f5',
    borderRadius: theme.shape.borderRadius,
  },
  paymentSuccess: {
    textAlign: 'center',
    padding: theme.spacing(6),
  },
  successIcon: {
    fontSize: 80,
    color: green[500],
    marginBottom: theme.spacing(2),
  },
  errorMessage: {
    color: theme.palette.error.main,
    marginTop: theme.spacing(1),
  },
  orderSummary: {
    position: 'sticky',
    top: theme.spacing(2),
  },
  '@keyframes fadeIn': {
    from: { opacity: 0, transform: 'translateY(10px)' },
    to: { opacity: 1, transform: 'translateY(0)' },
  },
  '@keyframes slideIn': {
    from: { opacity: 0, transform: 'translateX(20px)' },
    to: { opacity: 1, transform: 'translateX(0)' },
  },
  slideIn: {
    animation: '$slideIn 0.4s ease-out',
  },
  scaleIn: {
    animation: '$scaleIn.3s ease-out',
  },
  '@keyframes scaleIn': {
    from: { opacity: 0, transform: 'scale(0.9)' },
    to: { opacity: 1, transform: 'scale(1)' },
  },
}));

const steps = ['Shipping address', 'Payment details', 'Review your order'];

// Address Form Component with animations
const AddressForm = ({ formData, setFormData, errors, classes }) => {
  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  return (
    <Fade in={true} timeout={500}>
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
            error={!!errors.firstName}
            helperText={errors.firstName}
            variant="outlined"
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
            error={!!errors.lastName}
            helperText={errors.lastName}
            variant="outlined"
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
            error={!!errors.address1}
            helperText={errors.address1}
            variant="outlined"
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
            variant="outlined"
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
            error={!!errors.city}
            helperText={errors.city}
            variant="outlined"
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
            variant="outlined"
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
            error={!!errors.zip}
            helperText={errors.zip}
            variant="outlined"
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
            error={!!errors.country}
            helperText={errors.country}
            variant="outlined"
          />
        </Grid>
      </Grid>
    </Fade>
  );
};

// Payment Form Component with animations
const PaymentForm = ({ paymentData, setPaymentData, errors, classes }) => {
  const [selectedMethod, setSelectedMethod] = useState('creditCard');

  const handleMethodChange = (event) => {
    setSelectedMethod(event.target.value);
    setPaymentData({
      ...paymentData,
      method: event.target.value,
    });
  };

  const handleChange = (e) => {
    setPaymentData({
      ...paymentData,
      [e.target.name]: e.target.value,
    });
  };

  return (
    <Fade in={true} timeout={500}>
      <div>
        <Typography variant="h6" gutterBottom>
          Payment method
        </Typography>
        
        <FormControl component="fieldset" fullWidth margin="normal">
          <FormLabel component="legend">Select payment method</FormLabel>
          <RadioGroup
            aria-label="payment-method"
            name="method"
            value={selectedMethod}
            onChange={handleMethodChange}
          >
            <FormControlLabel
              value="creditCard"
              control={<Radio color="primary" />}
              label="Credit / Debit Card"
            />
            <FormControlLabel
              value="bankTransfer"
              control={<Radio color="primary" />}
              label="Bank Transfer"
            />
          </RadioGroup>
        </FormControl>
        
        {selectedMethod === 'creditCard' && (
          <div className={`${classes.paymentMethod} ${selectedMethod === 'creditCard' ? classes.paymentMethodSelected : ''}`}>
            <Box display="flex" alignItems="center" mb={2}>
              <CreditCard color="primary" className={classes.paymentIcon} />
              <Typography variant="body1">Credit Card Details</Typography>
            </Box>
            
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardName"
                  name="cardName"
                  label="Name on card"
                  fullWidth
                  autoComplete="cc-name"
                  value={paymentData.cardName || ''}
                  onChange={handleChange}
                  error={!!errors.cardName}
                  helperText={errors.cardName}
                  variant="outlined"
                />
              </Grid>
              <Grid item xs={12}>
                <TextField
                  required
                  id="cardNumber"
                  name="cardNumber"
                  label="Card number"
                  fullWidth
                  autoComplete="cc-number"
                  value={paymentData.cardNumber || ''}
                  onChange={handleChange}
                  error={!!errors.cardNumber}
                  helperText={errors.cardNumber}
                  variant="outlined"
                  inputProps={{ maxLength: 19 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="expDate"
                  name="expDate"
                  label="Expiry date (MM/YY)"
                  fullWidth
                  autoComplete="cc-exp"
                  value={paymentData.expDate || ''}
                  onChange={handleChange}
                  error={!!errors.expDate}
                  helperText={errors.expDate}
                  variant="outlined"
                  inputProps={{ maxLength: 5 }}
                />
              </Grid>
              <Grid item xs={12} sm={6}>
                <TextField
                  required
                  id="cvv"
                  name="cvv"
                  label="CVV"
                  fullWidth
                  autoComplete="cc-csc"
                  value={paymentData.cvv || ''}
                  onChange={handleChange}
                  error={!!errors.cvv}
                  helperText={errors.cvv}
                  variant="outlined"
                  inputProps={{ maxLength: 4 }}
                />
              </Grid>
            </Grid>
          </div>
        )}
        
        {selectedMethod === 'bankTransfer' && (
          <div className={`${classes.paymentMethod} ${selectedMethod === 'bankTransfer' ? classes.paymentMethodSelected : ''}`}>
            <Box display="flex" alignItems="center" mb={2}>
              <AccountBalance color="primary" className={classes.paymentIcon} />
              <Typography variant="body1">Bank Transfer Details</Typography>
            </Box>
            
            <div className={classes.paymentDetails}>
              <Typography variant="body1" gutterBottom>Please use the following details to complete your bank transfer:</Typography>
              <Typography variant="body2">Account Name: EventApp Inc.</Typography>
              <Typography variant="body2">Account Number: 12345678</Typography>
              <Typography variant="body2">Routing Number: 087654321</Typography>
              <Typography variant="body2">Bank: International Bank</Typography>
              <Typography variant="body2" style={{ marginTop: 16 }}>Reference: Your email address</Typography>
            </div>
          </div>
        )}
      </div>
    </Fade>
  );
};

// Review Component with animations
const Review = ({ cartItems, formData, paymentData, classes }) => {
  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  return (
    <Fade in={true} timeout={500}>
      <div>
        <Typography variant="h6" gutterBottom>
          Order summary
        </Typography>
        
        <Box mb={3}>
          {cartItems.map((item, index) => (
            <React.Fragment key={index}>
              <Box className={classes.summaryItem}>
                <Box>
                  <Typography variant="body1" style={{ fontWeight: 'bold' }}>
                    {item.eventTitle}
                  </Typography>
                  <Typography variant="body2" color="textSecondary">
                    {item.ticketType} × {item.quantity}
                  </Typography>
                </Box>
                <Typography variant="body1">${item.subtotal.toFixed(2)}</Typography>
              </Box>
              {index < cartItems.length - 1 && <Divider className={classes.divider} />}
            </React.Fragment>
          ))}
        </Box>
        
        <Divider className={classes.divider} />
        
        <Typography variant="h6" gutterBottom>
          Shipping
        </Typography>
        <Typography variant="body1">{`${formData.firstName} ${formData.lastName}`}</Typography>
        <Typography variant="body1">{formData.address1}</Typography>
        {formData.address2 && (
          <Typography variant="body1">{formData.address2}</Typography>
        )}
        <Typography variant="body1">
          {`${formData.city}, ${formData.state || ''} ${formData.zip}`}
        </Typography>
        <Typography variant="body1">{formData.country}</Typography>
        
        <Divider className={classes.divider} />
        
        <Typography variant="h6" gutterBottom>
          Payment
        </Typography>
        <Typography variant="body1">
          Method: {paymentData.method === 'creditCard' ? 'Credit Card' : 'Bank Transfer'}
        </Typography>
        {paymentData.method === 'creditCard' && (
          <Typography variant="body1">
            Card: •••• •••• •••• {paymentData.cardNumber?.slice(-4) || '****'}
          </Typography>
        )}
        
        <Divider className={classes.divider} />
        
        <Box className={classes.summaryItem}>
          <Typography variant="body1">Subtotal</Typography>
          <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
        </Box>
        <Box className={classes.summaryItem}>
          <Typography variant="body1">Service Fee</Typography>
          <Typography variant="body1">${serviceFee.toFixed(2)}</Typography>
        </Box>
        <Divider className={classes.divider} />
        <Box className={classes.summaryItem}>
          <Typography variant="h6" component="span">Total</Typography>
          <Typography variant="h6" component="span" className={classes.total}>${total.toFixed(2)}</Typography>
        </Box>
      </div>
    </Fade>
  );
};

// Main Checkout Form component
const CheckoutForm = ({ cartItems, createOrder, clearCart, user }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
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
  
  const [paymentData, setPaymentData] = useState({
    method: 'creditCard',
    cardName: '',
    cardNumber: '',
    expDate: '',
    cvv: '',
  });
  
  const [errors, setErrors] = useState({});
  const [processing, setProcessing] = useState(false);
  const [paymentSuccess, setPaymentSuccess] = useState(false);
  const [orderId, setOrderId] = useState(null);

  // Calculate totals
  const subtotal = cartItems.reduce((acc, item) => acc + item.subtotal, 0);
  const serviceFee = subtotal * 0.1; // 10% service fee
  const total = subtotal + serviceFee;

  const validateShippingForm = () => {
    const newErrors = {};
    
    if (!formData.firstName) newErrors.firstName = 'First name is required';
    if (!formData.lastName) newErrors.lastName = 'Last name is required';
    if (!formData.address1) newErrors.address1 = 'Address is required';
    if (!formData.city) newErrors.city = 'City is required';
    if (!formData.zip) newErrors.zip = 'Zip code is required';
    if (!formData.country) newErrors.country = 'Country is required';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const validatePaymentForm = () => {
    const newErrors = {};
    
    if (paymentData.method === 'creditCard') {
      if (!paymentData.cardName) newErrors.cardName = 'Name on card is required';
      if (!paymentData.cardNumber) {
        newErrors.cardNumber = 'Card number is required';
      } else if (!/^\d{15,16}$/.test(paymentData.cardNumber.replace(/\s/g, ''))) {
        newErrors.cardNumber = 'Invalid card number';
      }
      
      if (!paymentData.expDate) {
        newErrors.expDate = 'Expiry date is required';
      } else if (!/^\d{2}\/\d{2}$/.test(paymentData.expDate)) {
        newErrors.expDate = 'Invalid format (MM/YY)';
      }
      
      if (!paymentData.cvv) {
        newErrors.cvv = 'CVV is required';
      } else if (!/^\d{3,4}$/.test(paymentData.cvv)) {
        newErrors.cvv = 'Invalid CVV';
      }
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = async () => {
    // Validate current step
    if (activeStep === 0 && !validateShippingForm()) return;
    if (activeStep === 1 && !validatePaymentForm()) return;
    
    if (activeStep === steps.length - 1) {
      // Process order
      setProcessing(true);
      
      try {
        // Create order data for API
        const orderData = {
          items: cartItems.map(item => ({
            ticket: item.ticket,
            event: item.event,
            quantity: item.quantity,
            price: item.price,
            subtotal: item.subtotal
          })),
          shippingAddress: formData,
          paymentMethod: paymentData.method,
          totalAmount: total
        };
        
        // Call order creation API
        const response = await createOrder(orderData);
        
        // Set order ID from response
        setOrderId(response._id);
        
        // Clear the cart
        await clearCart();
        
        // Show success message
        setPaymentSuccess(true);
      } catch (err) {
        console.error("Order processing error:", err);
        setErrors({
          ...errors,
          submit: "There was an error processing your order. Please try again."
        });
      }
      
      setProcessing(false);
    } else {
      // Move to next step
      setActiveStep(activeStep + 1);
    }
  };

  const handleBack = () => {
    setActiveStep(activeStep - 1);
  };

  // If order successful, show success screen
  if (paymentSuccess) {
    return (
      <Fade in={true} timeout={500}>
        <div className={classes.paymentSuccess}>
          <CheckCircle className={classes.successIcon} />
          <Typography variant="h4" gutterBottom>
            Thank you for your order!
          </Typography>
          <Typography variant="h6" color="textSecondary" gutterBottom>
            Order Number: #{orderId}
          </Typography>
          <Typography variant="body1" paragraph style={{ maxWidth: '600px', margin: '20px auto' }}>
            We've sent a confirmation email with all the details of your purchase.
            You can view your order status anytime in your account.
          </Typography>
          <Box mt={4}>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/orders')}
              style={{ marginRight: '16px' }}
            >
              View My Orders
            </Button>
            <Button
              variant="outlined"
              color="primary"
              onClick={() => navigate('/')}
            >
              Continue Shopping
            </Button>
          </Box>
        </div>
      </Fade>
    );
  }

  // Custom step icons
  function StepIcon({ step, active, completed }) {
    let iconClass = classes.stepIcon;
    if (active) iconClass += ` ${classes.activeStepIcon}`;
    if (completed) iconClass += ` ${classes.completedStepIcon}`;
    
    let icon;
    
    switch (step) {
      case 0:
        icon = <LocalShipping />;
        break;
      case 1:
        icon = <PaymentIcon />;
        break;
      case 2:
        icon = <Receipt />;
        break;
      default:
        icon = null;
    }
    
    return <div className={iconClass}>{completed ? <CheckCircle /> : icon}</div>;
  }

  return (
    <>
      <Stepper activeStep={activeStep} className={classes.stepper} alternativeLabel>
        {steps.map((label, index) => (
          <Step key={label}>
            <StepLabel StepIconComponent={() => (
              <StepIcon
                step={index}
                active={activeStep === index}
                completed={activeStep > index}
              />
            )}>
              {label}
            </StepLabel>
          </Step>
        ))}
      </Stepper>
      
      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Paper className={classes.paper} elevation={3}>
            {activeStep === 0 && (
              <AddressForm
                formData={formData}
                setFormData={setFormData}
                errors={errors}
                classes={classes}
              />
            )}
            
            {activeStep === 1 && (
              <PaymentForm
                paymentData={paymentData}
                setPaymentData={setPaymentData}
                errors={errors}
                classes={classes}
              />
            )}
            
            {activeStep === 2 && (
              <Review
                cartItems={cartItems}
                formData={formData}
                paymentData={paymentData}
                classes={classes}
              />
            )}
            
            {errors.submit && (
              <Typography color="error" className={classes.errorMessage}>
                {errors.submit}
              </Typography>
            )}
            
            <div className={classes.buttons}>
              {activeStep !== 0 && (
                <Button
                  variant="outlined"
                  onClick={handleBack}
                  className={classes.button}
                  startIcon={<ArrowBack />}
                >
                  Back
                </Button>
              )}
              
              <Button
                variant="contained"
                color="primary"
                onClick={handleNext}
                className={classes.button}
                disabled={processing}
                endIcon={activeStep === steps.length - 1 ? null : <ArrowForward />}
              >
                {processing ? (
                  <CircularProgress size={24} color="inherit" />
                ) : activeStep === steps.length - 1 ? (
                  'Place Order'
                ) : (
                  'Next'
                )}
              </Button>
            </div>
          </Paper>
        </Grid>
        
        <Grid item xs={12} md={4}>
          <Paper className={classes.paper} elevation={3}>
            <Box className={classes.orderSummary}>
              <Typography variant="h6" gutterBottom>
                Order Summary
              </Typography>
              
              <Box>
                {cartItems.map((item, index) => (
                  <Box key={index} className={classes.summaryItem}>
                    <Typography variant="body2">
                      {item.eventTitle} ({item.quantity})
                    </Typography>
                    <Typography variant="body2">${item.subtotal.toFixed(2)}</Typography>
                  </Box>
                ))}
              </Box>
              
              <Divider className={classes.divider} />
              
              <Box className={classes.summaryItem}>
                <Typography variant="body1">Subtotal</Typography>
                <Typography variant="body1">${subtotal.toFixed(2)}</Typography>
              </Box>
              
              <Box className={classes.summaryItem}>
                <Typography variant="body1">Service Fee</Typography>
                <Typography variant="body1">${serviceFee.toFixed(2)}</Typography>
              </Box>
              
              <Divider className={classes.divider} />
              
              <Box className={classes.summaryItem} style={{ marginBottom: 16 }}>
                <Typography variant="h6">Total</Typography>
                <Typography variant="h6" className={classes.total}>${total.toFixed(2)}</Typography>
              </Box>
              
              {activeStep === steps.length - 1 && (
                <Button
                  variant="contained"
                  color="primary"
                  size="large"
                  fullWidth
                  onClick={handleNext}
                  disabled={processing}
                  startIcon={<PaymentIcon />}
                >
                  {processing ? <CircularProgress size={24} color="inherit" /> : 'Place Order'}
                </Button>
              )}
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
};

// Main Checkout component
const Checkout = ({ cart: { cartItems }, auth: { user }, createOrder, clearCart }) => {
  const classes = useStyles();
  const navigate = useNavigate();

  // Redirect to cart if cart is empty
  useEffect(() => {
    if (cartItems.length === 0) {
      navigate('/cart');
    }
  }, [cartItems, navigate]);

  if (cartItems.length === 0) {
    return null;
  }

  return (
    <Container className={classes.checkoutContainer}>
      <Typography variant="h4" gutterBottom>
        Checkout
      </Typography>
      <Paper className={classes.paper}>
        <CheckoutForm 
          cartItems={cartItems} 
          createOrder={createOrder} 
          clearCart={clearCart}
          user={user}
        />
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