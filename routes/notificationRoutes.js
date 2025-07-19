// routes/notificationRoutes.js
const express = require('express');
const router = express.Router();
const { saveSubscription } = require('../controllers/notificationController');

// @route   POST /api/save-subscription
// @desc    Save a push notification subscription
// @access  Public
router.post('/save-subscription', saveSubscription);

module.exports = router;