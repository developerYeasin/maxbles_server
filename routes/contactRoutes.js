// routes/contactRoutes.js
const express = require('express');
const router = express.Router();
const { body } = require('express-validator');
const { submitContactMessage, getAllMessages, deleteMessage } = require('../controllers/contactController');
const { protect } = require('../middleware/authMiddleware');

// Public Route
router.post(
    '/contact',
    [ // Validation middleware
        body('name', 'Name is required').not().isEmpty(),
        body('email', 'Please include a valid email').isEmail(),
        body('message', 'Message is required').not().isEmpty(),
    ],
    submitContactMessage
);

// Admin Only Routes
router.get('/contact/messages', protect, getAllMessages);
router.delete('/contact/messages/:id', protect, deleteMessage);

module.exports = router;