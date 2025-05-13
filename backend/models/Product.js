
const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
  name: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  price: { type: Number, required: true },
  quantity: { type: Number, required: true },
  location: { type: String, required: true },
  harvestDate: { type: String, required: true },
  unit: { type: String }, // Added unit field, optional
  imageUrl: { type: String },
  farmer: {
    email: String,
    name: String,
  },
}, { timestamps: true });

module.exports = mongoose.model('Product', productSchema);
