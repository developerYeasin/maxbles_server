// config/webpush.js
const webpush = require('web-push');

webpush.setVapidDetails(
    process.env.VAPID_MAILTO,
    process.env.VAPID_PUBLIC_KEY,
    process.env.VAPID_PRIVATE_KEY
);

const sendNotification = async (subscription, payload) => {
    try {
        await webpush.sendNotification(subscription, JSON.stringify(payload));
    } catch (error) {
        console.error('Error sending notification:', error);
    }
};

module.exports = {
    sendNotification
};