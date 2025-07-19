// controllers/notificationController.js
const db = require('../config/db');
const { sendNotification } = require('../config/webpush');

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

// @desc    Send a test push notification to all subscribers
// @route   POST /api/send-test-notification
// @access  Private (Admin)
const sendTestNotification = async (req, res) => {
    try {
        const [subscriptions] = await db.query('SELECT * FROM push_subscriptions');
        const notificationPayload = {
            title: 'Test Notification',
            body: 'This is a test notification from the server.',
            icon: 'path_to_icon'
        };

        for (const subscription of subscriptions) {
            const sub = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth
                }
            };
            await sendNotification(sub, notificationPayload);
        }

        res.status(200).json({ status: 'success', message: 'Test notification sent successfully.' });
    } catch (error) {
        console.error('Error sending test notification:', error);
        res.status(500).json({ status: 'error', message: 'Failed to send test notification.', error: error.message });
    }
};

// @desc    Get all push notification subscriptions
// @route   GET /api/subscriptions
// @access  Private (Admin)
const getAllSubscriptions = async (req, res) => {
    try {
        const [subscriptions] = await db.query('SELECT * FROM push_subscriptions');
        res.status(200).json(subscriptions);
    } catch (error) {
        console.error('Error getting subscriptions:', error);
        res.status(500).json({ status: 'error', message: 'Failed to get subscriptions.', error: error.message });
    }
};

module.exports = {
    saveSubscription,
    sendTestNotification,
    getAllSubscriptions
};