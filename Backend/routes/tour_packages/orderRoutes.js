// routes/api/orders.js

const express = require('express');
const router = express.Router();
const Order = require('../../models/tour_packages/Order');

// Create a new order
router.post('/', async (req, res) => {
  try {
    const newOrder = new Order(req.body);
    await newOrder.save();
    res.status(201).json(newOrder);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get all orders for a specific user
router.get('/user/:userId', async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.params.userId }).populate('package');
    res.status(200).json(orders);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

// Get a specific order by ID
router.get('/:id', async (req, res) => {
  try {
    const order = await Order.findById(req.params.id).populate('package');
    if (!order) return res.status(404).json({ error: 'Order not found' });
    res.status(200).json(order);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
});

module.exports = router;
