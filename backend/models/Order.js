
// backend/models/Order.js
const mongoose = require('mongoose');

const orderSchema = new mongoose.Schema({
  farmerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
    index: true, // Optimize queries by email
  },
  product: {
    type: String,
    required: true,
  },
  quantity: {
    type: String, // e.g., "100 kg"
    required: true,
  },
  price: {
    type: String, // e.g., "$200"
    required: true,
  },
  status: {
    type: String,
    enum: ['Pending', 'Confirmed', 'Cancelled'],
    default: 'Pending',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Order', orderSchema);
