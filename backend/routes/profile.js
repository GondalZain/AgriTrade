
// backend/routes/profile.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const authMiddleware = require('../middleware/auth');

// Get farmer profile
router.get('/:email', authMiddleware, async (req, res) => {
  try {
    const user = await User.findOne({ email: req.params.email.toLowerCase().trim() });
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    res.json({
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      phoneNumber: user.phoneNumber,
      address: user.address,
      city: user.city,
      zipCode: user.zipCode,
    });
  } catch (error) {
    console.error('Error fetching profile:', error);
    res.status(500).json({ error: 'Server error' });
  }
});

// Update farmer profile
router.put('/:email', authMiddleware, async (req, res) => {
  try {
    const { firstName, lastName, phoneNumber, address, city, zipCode } = req.body;
    const user = await User.findOne({ email: req.params.email.toLowerCase().trim() });
    if (!user || user.role !== 'farmer') {
      return res.status(404).json({ error: 'Farmer not found' });
    }
    user.firstName = firstName || user.firstName;
    user.lastName = lastName || user.lastName;
    user.phoneNumber = phoneNumber || user.phoneNumber;
    user.address = address || user.address;
    user.city = city || user.city;
    user.zipCode = zipCode || user.zipCode;
    await user.save();
    res.json({ message: 'Profile updated successfully' });
  } catch (error) {
    console.error('Error updating profile:', error);
    if (error.name === 'ValidationError') {
      const messages = Object.values(error.errors).map((err) => err.message);
      return res.status(400).json({ message: messages.join(', ') });
    }
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
