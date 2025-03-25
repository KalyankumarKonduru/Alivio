import React, { useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Button,
  Divider,
  List,
  ListItem,
  ListItemText,
  Box,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Check, Print, ArrowBack } from '@material-ui/icons';
import { getOrderById } from '../redux/actions/orderActions';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
  },
  divider: {
    margin: theme.spacing(3, 0),
  },
  successIcon: {
    fontSize: 64,
    color: theme.palette.success.main,
    marginBottom: theme.spacing(2),
  },
  orderNumber: {
    fontWeight: 'bold',
    marginBottom: theme.spacing(3),
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
  totalAmount: {
    fontWeight: 'bold',
    marginTop: theme.spacing(2),
    textAlign: 'right',
  },
}));

const OrderConfirmation = ({ getOrderById, orders: { order, loading } }) => {
  const classes = useStyles();
  const { id } = useParams();
  const navigate = useNavigate();
  
  useEffect(() => {
    getOrderById(id);
  }, [getOrderById, id]);
  
  const handlePrint = () => {
    window.print();
  };
  
  const handleBackToEvents = () => {
    navigate('/');
  };
  
  if (loading || !order) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <Container className={classes.container}>
      <Paper className={classes.paper}>
        <Box display="flex" flexDirection="column" alignItems="center" mb={4}>
          <Check className={classes.successIcon} />
          <Typography variant="h4" gutterBottom>
            Order Confirmed!
          </Typography>
          <Typography variant="h6" className={classes.orderNumber}>
            Order Number: {order.orderNumber}
          </Typography>
          <Typography variant="body1">
            Thank you for your purchase. A confirmation email has been sent to your email address.
          </Typography>
        </Box>
        
        <Divider className={classes.divider} />
        
        <Typography variant="h6" className={classes.sectionTitle}>
          Order Details
        </Typography>
        
        <List>
          {order.items.map((item, index) => (
            <ListItem key={index} divider>
              <ListItemText
                primary={item.event.title}
                secondary={`${item.ticket.type} - ${new Date(item.event.date).toLocaleDateString()}`}
              />
              <ListItemText
                primary={`$${item.price.toFixed(2)} x ${item.quantity}`}
                secondary={`Total: $${item.subtotal.toFixed(2)}`}
                align="right"
              />
            </ListItem>
          ))}
        </List>
        
        <Typography variant="h6" className={classes.totalAmount}>
          Total Amount: ${order.totalAmount.toFixed(2)}
        </Typography>
        
        <Divider className={classes.divider} />
        
        <Typography variant="h6" className={classes.sectionTitle}>
          Shipping Information
        </Typography>
        
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6}>
            <Typography variant="body1">
              {`${order.shippingAddress.firstName} ${order.shippingAddress.lastName}`}
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress.address1}
            </Typography>
            {order.shippingAddress.address2 && (
              <Typography variant="body1">
                {order.shippingAddress.address2}
              </Typography>
            )}
            <Typography variant="body1">
              {`${order.shippingAddress.city}, ${order.shippingAddress.state} ${order.shippingAddress.zip}`}
            </Typography>
            <Typography variant="body1">
              {order.shippingAddress.country}
            </Typography>
          </Grid>
        </Grid>
        
        <Box mt={4} display="flex">
          <Button
            variant="contained"
            color="primary"
            startIcon={<Print />}
            className={classes.button}
            onClick={handlePrint}
          >
            Print Receipt
          </Button>
          
          <Button
            variant="outlined"
            startIcon={<ArrowBack />}
            className={classes.button}
            onClick={handleBackToEvents}
          >
            Back to Events
          </Button>
        </Box>
      </Paper>
    </Container>
  );
};

OrderConfirmation.propTypes = {
  getOrderById: PropTypes.func.isRequired,
  orders: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  orders: state.orders
});

export default connect(mapStateToProps, { getOrderById })(OrderConfirmation);
