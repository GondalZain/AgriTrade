
// backend/models/Bid.js
const mongoose = require('mongoose');

const bidSchema = new mongoose.Schema({
  orderId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Order',
    required: true,
    index: true, // Optimize queries by order
  },
  buyerEmail: {
    type: String,
    required: true,
    lowercase: true,
    trim: true,
  },
  bidAmount: {
    type: String, // e.g., "$210"
    required: true,
  },
  status: {
    type: String,
    enum: ['Open', 'Accepted', 'Rejected'],
    default: 'Open',
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

module.exports = mongoose.model('Bid', bidSchema);
