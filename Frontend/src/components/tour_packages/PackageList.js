import React, { useState, useEffect } from 'react';
import axios from 'axios';
import {
  Container,
  Typography,
  Grid,
  Card,
  CardContent,
  Button,
  CircularProgress,
  Alert,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField,
} from '@mui/material';
import { useAuth } from '../../contexts/AuthContext';

const PackageList = () => {
  const { user } = useAuth();
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [paymentDetails, setPaymentDetails] = useState({
    cardNumber: '',
    cardHolder: '',
    expiryDate: '',
    cvv: '',
  });
  const [paymentError, setPaymentError] = useState('');

  useEffect(() => {
    const fetchPackages = async () => {
      try {
        const response = await axios.get('http://localhost:5000/api/packages');
        setPackages(response.data);
      } catch (err) {
        setError('Error fetching packages');
      } finally {
        setLoading(false);
      }
    };

    fetchPackages();
  }, []);

  const handleBuyOpen = (pkg) => {
    setSelectedPackage(pkg);
    setOpen(true);
  };

  const handleBuyClose = () => {
    setOpen(false);
    setSelectedPackage(null);
    setPaymentDetails({
      cardNumber: '',
      cardHolder: '',
      expiryDate: '',
      cvv: '',
    });
    setPaymentError('');
  };

  const handlePaymentChange = (e) => {
    setPaymentDetails({
      ...paymentDetails,
      [e.target.name]: e.target.value.toUpperCase(), // Ensures card holder name is uppercase
    });
  };

  const validatePaymentDetails = () => {
    const { cardNumber, cardHolder, expiryDate, cvv } = paymentDetails;

    if (cardNumber.length !== 16 || isNaN(cardNumber)) {
      return 'Card number must be 16 digits';
    }
    if (cardHolder.trim().length === 0) {
      return 'Card holder name is required';
    }
    if (!/^\d{2}\/\d{2}$/.test(expiryDate)) {
      return 'Expiry date must be in MM/YY format';
    }
    if (cvv.length !== 3 || isNaN(cvv)) {
      return 'CVV must be 3 digits';
    }

    return '';
  };

  const handlePaymentSubmit = async () => {
    const validationError = validatePaymentDetails();
    if (validationError) {
      setPaymentError(validationError);
      return;
    }

    try {
      const orderData = {
        userId: user._id, // Assuming user._id is available from AuthContext
        package: selectedPackage._id,
        paymentStatus: 'Paid',
        name: selectedPackage.name,
      };

      await axios.post('http://localhost:5000/api/orders', orderData);
      handleBuyClose();
      window.location.href = '/';
    } catch (err) {
      setError('Error processing payment');
    }
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tour Packages
      </Typography>
      <Grid container spacing={3}>
        {packages.map((pkg) => (
          <Grid item xs={12} sm={6} md={4} key={pkg._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{pkg.name}</Typography>
                <Typography variant="body1">{pkg.description}</Typography>
                <Typography variant="h6">${pkg.price}</Typography>
                <Button
                  variant="contained"
                  color="primary"
                  onClick={() => handleBuyOpen(pkg)}
                >
                  Buy
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Payment Dialog */}
      <Dialog open={open} onClose={handleBuyClose}>
        <DialogTitle>Payment Details</DialogTitle>
        <DialogContent>
          <TextField
            label="Card Holder"
            name="cardHolder"
            fullWidth
            margin="dense"
            onChange={handlePaymentChange}
            value={paymentDetails.cardHolder.toUpperCase()} // Display in uppercase
          />
          <TextField
            label="Card Number"
            name="cardNumber"
            fullWidth
            margin="dense"
            onChange={handlePaymentChange}
            type="text"
            inputProps={{ maxLength: 16 }} // Limit input to 16 digits
            value={paymentDetails.cardNumber}
          />
          <TextField
            label="Expiry Date (MM/YY)"
            name="expiryDate"
            fullWidth
            margin="dense"
            onChange={handlePaymentChange}
            placeholder="MM/YY"
            inputProps={{ maxLength: 5 }} // Limit input to 5 characters
            value={paymentDetails.expiryDate}
          />
          <TextField
            label="CVV"
            name="cvv"
            fullWidth
            margin="dense"
            onChange={handlePaymentChange}
            type="text"
            inputProps={{ maxLength: 3 }} // Limit input to 3 digits
            value={paymentDetails.cvv}
          />
          {paymentError && <Alert severity="error">{paymentError}</Alert>}
        </DialogContent>
        <DialogActions>
          <Button onClick={handleBuyClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handlePaymentSubmit} color="primary">
            Pay
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PackageList;
