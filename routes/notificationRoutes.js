// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { saveSubscription, sendTestNotification, getAllSubscriptions } = require('../controllers/notificationController');
const { protect } = require('../middleware/authMiddleware');

// @route   POST /api/save-subscription
// @desc    Save a push notification subscription
// @access  Public
router.post('/save-subscription', saveSubscription);

// @route   POST /api/send-test-notification
// @desc    Send a test push notification to all subscribers
// @access  Private (Admin)
router.post('/send-test-notification', protect, sendTestNotification);

// @route   GET /api/subscriptions
// @desc    Get all push notification subscriptions
// @access  Private (Admin)
router.get('/subscriptions', protect, getAllSubscriptions);

module.exports = router;