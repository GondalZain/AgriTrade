
// backend/routes/notifications.js
const express = require('express');
const router = express.Router();
const Notification = require('../models/Notification');
const authMiddleware = require('../middleware/auth');

// Get all notifications for the authenticated user
router.get('/', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    console.log('Fetching notifications for:', lowerEmail);
    const notifications = await Notification.find({ userEmail: lowerEmail }).sort({
      timestamp: -1,
    });
    res.json(notifications);
  } catch (error) {
    console.error('Error fetching notifications:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

// Mark a notification as read
router.put('/:id/read', authMiddleware, async (req, res) => {
  try {
    if (!req.user || !req.user.email) {
      console.error('User not authenticated or email missing');
      return res.status(401).json({ error: 'User not authenticated' });
    }
    const lowerEmail = req.user.email.toLowerCase().trim();
    const { id } = req.params;

    const notification = await Notification.findOne({
      _id: id,
      userEmail: lowerEmail,
    });

    if (!notification) {
      console.error('Notification not found for:', lowerEmail, id);
      return res.status(404).json({ error: 'Notification not found' });
    }

    notification.isRead = true;
    await notification.save();

    console.log('Notification marked as read:', id, 'for user:', lowerEmail);
    res.json({ message: 'Notification marked as read' });
  } catch (error) {
    console.error('Error marking notification as read:', error.message);
    res.status(500).json({ error: 'Server error' });
  }
});

module.exports = router;
