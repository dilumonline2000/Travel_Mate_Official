import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Container, Typography, Grid, Card, CardContent, Button, CircularProgress, Alert, Dialog, DialogActions, DialogContent, DialogTitle, TextField } from '@mui/material';
import { Edit, Delete, PictureAsPdf } from '@mui/icons-material';
import jsPDF from 'jspdf';

const PackageView = () => {
  const [packages, setPackages] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [open, setOpen] = useState(false);
  const [selectedPackage, setSelectedPackage] = useState(null);
  const [updatedData, setUpdatedData] = useState({
    name: '',
    description: '',
    price: ''
  });
  const [searchTerm, setSearchTerm] = useState('');

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

  const handleDelete = async (packageId) => {
    try {
      await axios.delete(`http://localhost:5000/api/packages/${packageId}`);
      setPackages(prevPackages => prevPackages.filter(pkg => pkg._id !== packageId));
    } catch (err) {
      setError('Error deleting package');
    }
  };

  const handleUpdateOpen = (pkg) => {
    setSelectedPackage(pkg);
    setUpdatedData({
      name: pkg.name,
      description: pkg.description,
      price: pkg.price
    });
    setOpen(true);
  };

  const handleUpdateClose = () => {
    setOpen(false);
    setSelectedPackage(null);
    setUpdatedData({
      name: '',
      description: '',
      price: ''
    });
  };

  const handleUpdateChange = (e) => {
    setUpdatedData({
      ...updatedData,
      [e.target.name]: e.target.value
    });
  };

  const handleUpdateSubmit = async () => {
    try {
      await axios.put(`http://localhost:5000/api/packages/${selectedPackage._id}`, updatedData);
      setPackages(prevPackages =>
        prevPackages.map(pkg =>
          pkg._id === selectedPackage._id ? { ...pkg, ...updatedData } : pkg
        )
      );
      handleUpdateClose();
    } catch (err) {
      setError('Error updating package');
    }
  };

  const handleSearch = (e) => {
    setSearchTerm(e.target.value);
  };

  const filteredPackages = packages.filter(pkg =>
    pkg.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    pkg.description.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleGeneratePdf = () => {
    const doc = new jsPDF();
  
    doc.setFontSize(18);
    doc.text('Tour Packages', 20, 20);
    doc.setFontSize(12);
    doc.setTextColor(100);
  
    filteredPackages.forEach((pkg, index) => {
      const y = 30 + (index * 30); // Adjust the vertical spacing between packages
      doc.text(`Package Name: ${pkg.name}`, 20, y);
      doc.text(`Description: ${pkg.description}`, 20, y + 7);
      doc.text(`Price: $${pkg.price}`, 20, y + 14);
      doc.line(20, y + 20, 190, y + 20); // Add a line separator between packages
    });
  
    doc.save('packages.pdf');
  };

  if (loading) return <CircularProgress />;
  if (error) return <Alert severity="error">{error}</Alert>;

  return (
    <Container>
      <Typography variant="h4" gutterBottom>
        Tour Packages
      </Typography>
      <TextField
        label="Search Packages"
        fullWidth
        margin="normal"
        value={searchTerm}
        onChange={handleSearch}
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<PictureAsPdf />}
        onClick={handleGeneratePdf}
        style={{ marginBottom: '1rem' }}
      >
        Download PDF
      </Button>
      <Grid container spacing={3}>
        {filteredPackages.map(pkg => (
          <Grid item xs={12} sm={6} md={4} key={pkg._id}>
            <Card>
              <CardContent>
                <Typography variant="h5">{pkg.name}</Typography>
                <Typography variant="body1">{pkg.description}</Typography>
                <Typography variant="h6">${pkg.price}</Typography>
                <Button
                  variant="outlined"
                  color="primary"
                  startIcon={<Edit />}
                  onClick={() => handleUpdateOpen(pkg)}
                  style={{ marginRight: '1rem' }}
                >
                  Update
                </Button>
                <Button
                  variant="outlined"
                  color="error"
                  startIcon={<Delete />}
                  onClick={() => handleDelete(pkg._id)}
                >
                  Delete
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Update Dialog */}
      <Dialog open={open} onClose={handleUpdateClose}>
        <DialogTitle>Update Package</DialogTitle>
        <DialogContent>
          <TextField
            label="Name"
            name="name"
            fullWidth
            margin="dense"
            value={updatedData.name}
            onChange={handleUpdateChange}
          />
          <TextField
            label="Description"
            name="description"
            fullWidth
            margin="dense"
            multiline
            rows={4}
            value={updatedData.description}
            onChange={handleUpdateChange}
          />
          <TextField
            label="Price"
            name="price"
            fullWidth
            margin="dense"
            type="number"
            value={updatedData.price}
            onChange={handleUpdateChange}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={handleUpdateClose} color="primary">
            Cancel
          </Button>
          <Button onClick={handleUpdateSubmit} color="primary">
            Update
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default PackageView;
