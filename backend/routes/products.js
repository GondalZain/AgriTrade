
// backend/routes/products.js
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const authMiddleware = require('../middleware/auth');

// Get all products (e.g., for buyers or public access)
router.get('/', async (req, res) => {
  try {
    const products = await Product.find();
    res.json({ products });
  } catch (error) {
    console.error('Error fetching products:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
