// controllers/notificationController.js
const db = require('../config/db');

// @desc    Save a push notification subscription
// @route   POST /api/save-subscription
// @access  Public
const saveSubscription = async (req, res) => {
    const subscription = req.body;
    const ip_address = req.ip;
    const user_agent = req.get('user-agent');

    try {
        const newSubscription = {
            endpoint: subscription.endpoint,
            p256dh: subscription.keys.p256dh,
            auth: subscription.keys.auth,
            ip_address,
            user_agent
        };

        await db.query('INSERT INTO push_subscriptions SET ?', newSubscription);
        res.status(201).json({ status: 'success', message: 'Subscription saved successfully.' });
    } catch (error) {
        console.error('Error saving subscription:', error);
        res.status(500).json({ status: 'error', message: 'Failed to save subscription.', error: error.message });
    }
};

module.exports = {
    saveSubscription
};