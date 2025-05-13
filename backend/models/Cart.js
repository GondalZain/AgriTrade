
// backend/models/Cart.js
const mongoose = require('mongoose');

const cartSchema = new mongoose.Schema({
  buyer: { type: String, required: true },
  items: [{
    product: {
      _id: String,
      name: String,
      price: Number,
    },
    quantity: { type: Number, required: true },
  }],
}, { timestamps: true });

module.exports = mongoose.model('Cart', cartSchema);
