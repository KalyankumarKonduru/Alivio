import React, { useEffect } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  Box,
  CircularProgress,
  makeStyles
} from '@material-ui/core';
import { Receipt, Visibility } from '@material-ui/icons';
import { useNavigate } from 'react-router-dom';
import { getUserOrders } from '../redux/actions/orderActions';

const useStyles = makeStyles((theme) => ({
  container: {
    marginTop: theme.spacing(4),
    marginBottom: theme.spacing(8),
  },
  paper: {
    padding: theme.spacing(3),
  },
  tableContainer: {
    marginTop: theme.spacing(3),
  },
  emptyMessage: {
    textAlign: 'center',
    padding: theme.spacing(4),
  },
  button: {
    margin: theme.spacing(0.5),
  },
  loadingContainer: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '400px',
  },
}));

const UserOrders = ({ getUserOrders, orders: { userOrders, loading } }) => {
  const classes = useStyles();
  const navigate = useNavigate();
  
  useEffect(() => {
    getUserOrders();
  }, [getUserOrders]);
  
  const handleViewOrder = (orderId) => {
    navigate(`/orders/${orderId}`);
  };
  
  if (loading) {
    return (
      <div className={classes.loadingContainer}>
        <CircularProgress />
      </div>
    );
  }
  
  return (
    <Container className={classes.container}>
      <Typography variant="h4" gutterBottom>
        My Orders
      </Typography>
      
      <Paper className={classes.paper}>
        {userOrders && userOrders.length > 0 ? (
          <TableContainer className={classes.tableContainer}>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Order Number</TableCell>
                  <TableCell>Date</TableCell>
                  <TableCell>Items</TableCell>
                  <TableCell>Total</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Actions</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {userOrders.map((order) => (
                  <TableRow key={order._id}>
                    <TableCell>{order.orderNumber}</TableCell>
                    <TableCell>
                      {new Date(order.createdAt).toLocaleDateString()}
                    </TableCell>
                    <TableCell>
                      {order.items.reduce((total, item) => total + item.quantity, 0)} tickets
                    </TableCell>
                    <TableCell>${order.totalAmount.toFixed(2)}</TableCell>
                    <TableCell>
                      <Box 
                        component="span" 
                        px={1.5} 
                        py={0.5} 
                        borderRadius={4} 
                        bgcolor={
                          order.status === 'completed' 
                            ? 'success.light' 
                            : order.status === 'cancelled' 
                              ? 'error.light' 
                              : 'warning.light'
                        }
                      >
                        {order.status.charAt(0).toUpperCase() + order.status.slice(1)}
                      </Box>
                    </TableCell>
                    <TableCell>
                      <Button
                        variant="outlined"
                        color="primary"
                        size="small"
                        className={classes.button}
                        startIcon={<Visibility />}
                        onClick={() => handleViewOrder(order._id)}
                      >
                        View
                      </Button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        ) : (
          <div className={classes.emptyMessage}>
            <Receipt fontSize="large" color="disabled" />
            <Typography variant="h6" color="textSecondary" gutterBottom>
              No Orders Found
            </Typography>
            <Typography variant="body1" color="textSecondary">
              You haven't placed any orders yet.
            </Typography>
            <Button
              variant="contained"
              color="primary"
              onClick={() => navigate('/')}
              style={{ marginTop: 16 }}
            >
              Browse Events
            </Button>
          </div>
        )}
      </Paper>
    </Container>
  );
};

UserOrders.propTypes = {
  getUserOrders: PropTypes.func.isRequired,
  orders: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  orders: state.orders
});

export default connect(mapStateToProps, { getUserOrders })(UserOrders);
