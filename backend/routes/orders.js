
// backend/routes/orders.js
const express = require('express');
const router = express.Router();
const Order = require('../models/Order');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// Get all orders for the authenticated farmer
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    console.log('Fetching orders for:', lowerEmail);
    const orders = await Order.find({ farmerEmail: lowerEmail }).populate('bids');
    res.json(orders);
  } catch (error) {
    console.error('Error fetching orders:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Accept a bid
router.put('/bids/:bidId/accept', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    const { bidId } = req.params;

    const order = await Order.findOne({
      'bids._id': bidId,
      farmerEmail: lowerEmail,
    });

    if (!order) {
      console.error('Order or bid not found for:', lowerEmail, bidId);
      return res.status(404).json({ error: 'Order or bid not found' });
    }

    const bid = order.bids.id(bidId);
    if (bid.status !== 'Open') {
      console.error('Bid is not open:', bidId, bid.status);
      return res.status(400).json({ error: 'Bid is not open' });
    }

    bid.status = 'Accepted';
    order.status = 'Confirmed';
    await order.save();

    // Create notification
    const notification = new Notification({
      userEmail: lowerEmail,
      message: `Bid accepted for order: ${order.product}`,
      type: 'bid',
      timestamp: new Date(),
      isRead: false,
    });
    await notification.save();

    console.log('Bid accepted:', bidId, 'for user:', lowerEmail);
    res.json({ message: 'Bid accepted successfully' });
  } catch (error) {
    console.error('Error accepting bid:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Reject a bid
router.put('/bids/:bidId/reject', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    const { bidId } = req.params;

    const order = await Order.findOne({
      'bids._id': bidId,
      farmerEmail: lowerEmail,
    });

    if (!order) {
      console.error('Order or bid not found for:', lowerEmail, bidId);
      return res.status(404).json({ error: 'Order or bid not found' });
    }

    const bid = order.bids.id(bidId);
    if (bid.status !== 'Open') {
      console.error('Bid is not open:', bidId, bid.status);
      return res.status(400).json({ error: 'Bid is not open' });
    }

    bid.status = 'Rejected';
    await order.save();

    console.log('Bid rejected:', bidId, 'for user:', lowerEmail);
    res.json({ message: 'Bid rejected successfully' });
  } catch (error) {
    console.error('Error rejecting bid:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
