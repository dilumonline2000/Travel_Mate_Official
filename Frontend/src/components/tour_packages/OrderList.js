import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  CircularProgress,
  Alert,
  IconButton,
  CardActions,
  Box,
} from '@mui/material';
import { CheckCircle, Cancel, ShoppingCart } from '@mui/icons-material';

const OrderList = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const user = JSON.parse(localStorage.getItem('userInfo')); // Parse the user info
        if (!user || !user._id) {
          setError('User not authenticated');
          return;
        }

        const response = await axios.get(`http://localhost:5000/api/orders/user/${user._id}`);
        setOrders(response.data);
        console.log("Data: ", response.data);
      } catch (err) {
        setError('Error fetching orders');
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Box my={4}>
        <Typography variant="h4" gutterBottom align="center">
          My Orders
        </Typography>
      </Box>
      <Grid container spacing={3}>
        {orders.map(order => (
          <Grid item xs={12} sm={6} md={4} key={order._id}>
            <Card
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: '#f5f5f5',
              }}
            >
              <CardContent>
                <Box display="flex" alignItems="center" mb={2}>
                  <ShoppingCart style={{ marginRight: '8px', color: '#1976d2' }} />
                  <Typography variant="h6">Order ID: {order._id}</Typography>
                </Box>
                <Typography variant="h5" gutterBottom>
                  {order.name}
                </Typography>
                <Box display="flex" alignItems="center" mt={2}>
                  {order.paymentStatus === 'Paid' ? (
                    <CheckCircle style={{ color: 'green', marginRight: '8px' }} />
                  ) : (
                    <Cancel style={{ color: 'red', marginRight: '8px' }} />
                  )}
                  <Typography variant="h6">
                    {order.paymentStatus === 'Paid' ? 'Payment Completed' : 'Payment Pending'}
                  </Typography>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
};

export default OrderList;
