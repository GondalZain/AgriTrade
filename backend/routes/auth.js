
// backend/routes/auth.js
const express = require('express');
const router = express.Router();
const User = require('../models/User');
const jwt = require('jsonwebtoken');

router.post('/register', async (req, res) => {
  try {
    const { firstName, lastName, email, phoneNumber, password, role, address, city, zipCode } = req.body;
    if (!firstName || !lastName || !email || !phoneNumber || !password || !role || !address || !city || !zipCode) {
      console.error('Missing required fields in registration');
      return res.status(400).json({ error: 'All fields are required' });
    }
    const existingUser = await User.findOne({ email: email.toLowerCase().trim() });
    if (existingUser) {
      console.error('User already exists:', email);
      return res.status(400).json({ error: 'User already exists' });
    }
    const user = new User({
      firstName,
      lastName,
      email: email.toLowerCase().trim(),
      phoneNumber,
      password,
      role,
      address,
      city,
      zipCode,
    });
    await user.save();
    console.log('User registered:', user.email);
    res.status(201).json({ message: 'User registered successfully' });
  } catch (error) {
    console.error('Error during registration:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

router.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;
    if (!email || !password) {
      console.error('Missing email or password');
      return res.status(400).json({ error: 'Email and password are required' });
    }
    const user = await User.findOne({ email: email.toLowerCase().trim() });
    if (!user) {
      console.error('User not found:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    console.log('User found:', { email: user.email, role: user.role });
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.error('Invalid password for user:', email);
      return res.status(401).json({ error: 'Invalid credentials' });
    }
    const payload = {
      id: user._id,
      email: user.email,
      role: user.role,
    };
    const token = jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' });
    console.log('Login successful for user:', user.email, 'Token payload:', payload);
    res.json({ token, email: user.email, role: user.role });
  } catch (error) {
    console.error('Error during login:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
