// models/tour_packages/Order.js

const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  userId: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  package: { type: String, required: true },
  paymentStatus: { type: String, enum: ['Pending', 'Paid'], default: 'Pending' },
  name: { type: String, required: true },
  createdAt: { type: Date, default: Date.now },
});

module.exports = mongoose.model('Order', orderSchema);
