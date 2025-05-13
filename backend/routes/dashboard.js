
const express = require('express');
const router = express.Router();
const Product = require('../models/Product');
const Order = require('../models/Order');
const Update = require('../models/Update');
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');
const mongoose = require('mongoose');

// Get dashboard stats and recent updates (initial fetch)
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    console.log('Fetching dashboard data for:', lowerEmail);

    // Fetch counts with correct field names
    const cropCount = await Product.countDocuments({ 'farmer.email': lowerEmail });
    const orderCount = await Order.countDocuments({ 'farmer.email': lowerEmail });
    const notificationCount = await Notification.countDocuments({ userEmail: lowerEmail, isRead: false });

    // Fetch recent updates (latest 3 updates)
    const recentUpdates = await Update.find({ farmer: lowerEmail })
      .sort({ createdAt: -1 })
      .limit(3)
      .select('message createdAt');

    res.json({
      stats: {
        crops: cropCount,
        orders: orderCount,
        updates: notificationCount,
      },
      recentUpdates: recentUpdates.map((update) => ({
        message: update.message,
        timestamp: update.createdAt,
      })),
    });
  } catch (error) {
    console.error('Error fetching dashboard data:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// SSE stream endpoint
router.get('/stream', authMiddleware, (req, res) => {
  if (!req.user || !req.user.email) {
    console.error('User not authenticated or email missing for SSE');
    res.status(401).json({ error: 'User not authenticated' });
    return;
  }
  const lowerEmail = req.user.email.toLowerCase().trim();
  console.log('SSE connection established for:', lowerEmail);

  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  // Send initial counts
  const sendInitialCounts = async () => {
    try {
      const [cropCount, orderCount, notificationCount] = await Promise.all([
        Product.countDocuments({ 'farmer.email': lowerEmail }),
        Order.countDocuments({ 'farmer.email': lowerEmail }),
        Notification.countDocuments({ userEmail: lowerEmail, isRead: false }),
      ]);
      res.write(`data: ${JSON.stringify({ type: 'initial', stats: { crops: cropCount, orders: orderCount, updates: notificationCount } })}\n\n`);
    } catch (error) {
      console.error('Error sending initial counts:', error.message);
    }
  };
  sendInitialCounts();

  // Set up MongoDB change streams
  const productChangeStream = Product.watch([
    { $match: { 'fullDocument.farmer.email': lowerEmail, operationType: { $in: ['insert', 'delete'] } } },
  ]);
  const orderChangeStream = Order.watch([
    { $match: { 'fullDocument.farmer.email': lowerEmail, operationType: { $in: ['insert', 'delete'] } } },
  ]);
  const updateChangeStream = Update.watch([
    { $match: { 'fullDocument.farmer': lowerEmail, operationType: { $in: ['insert', 'update', 'delete'] } } },
  ]);
  const notificationChangeStream = Notification.watch([
    { $match: { 'fullDocument.userEmail': lowerEmail, operationType: { $in: ['insert', 'update', 'delete'] } } },
  ]);

  // Handle product changes
  productChangeStream.on('change', async (change) => {
    const count = await Product.countDocuments({ 'farmer.email': lowerEmail });
    res.write(`data: ${JSON.stringify({ type: 'crop', count })}\n\n`);
  });

  // Handle order changes
  orderChangeStream.on('change', async (change) => {
    const count = await Order.countDocuments({ 'farmer.email': lowerEmail });
    res.write(`data: ${JSON.stringify({ type: 'order', count })}\n\n`);
  });

  // Handle update changes (for recent updates)
  updateChangeStream.on('change', async (change) => {
    const count = await Update.countDocuments({ farmer: lowerEmail });
    let update = null;
    if (change.operationType === 'insert') {
      update = {
        message: change.fullDocument.message,
        timestamp: change.fullDocument.createdAt,
      };
    } else if (change.operationType === 'update') {
      const updatedDoc = await Update.findById(change.documentKey._id);
      update = updatedDoc ? {
        message: updatedDoc.message,
        timestamp: updatedDoc.createdAt,
      } : null;
    }
    res.write(`data: ${JSON.stringify({ type: 'update', count, update })}\n\n`);
  });

  // Handle notification changes (for stats.updates)
  notificationChangeStream.on('change', async (change) => {
    const count = await Notification.countDocuments({ userEmail: lowerEmail, isRead: false });
    res.write(`data: ${JSON.stringify({ type: 'notification', count })}\n\n`);
  });

  // Cleanup on connection close
  req.on('close', () => {
    console.log('SSE connection closed for:', lowerEmail);
    productChangeStream.close();
    orderChangeStream.close();
    updateChangeStream.close();
    notificationChangeStream.close();
    res.end();
  });
});

// Endpoint to mark all notifications as read
router.post('/notifications/mark-read', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    console.log('Marking notifications as read for:', lowerEmail);

    const result = await Notification.updateMany(
      { userEmail: lowerEmail, isRead: false },
      { $set: { isRead: true } }
    );

    res.json({ message: 'Notifications marked as read', affected: result.modifiedCount });
  } catch (error) {
    console.error('Error marking notifications as read:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
