// controllers/contactController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const { validationResult } = require('express-validator');

// @desc    Submit a contact message
// @route   POST /api/contact
// @access  Public
const submitContactMessage = async (req, res) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
        const formattedErrors = {};
        errors.array().forEach(err => {
            formattedErrors[err.param] = err.msg;
        });
        return res.status(400).json({
            status: 'error',
            message: 'Validation failed',
            errors: formattedErrors
        });
    }

    const { name, email, subject, message } = req.body;
    try {
        const newMessage = {
            id: uuidv4(),
            name,
            email,
            subject,
            message,
            received_at: new Date()
        };

        await db.query('INSERT INTO contact_messages SET ?', newMessage);

        res.status(200).json({
            status: 'success',
            message: 'Your message has been sent successfully!',
            data: newMessage,
        });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to send message. Please try again later.' });
    }
};

// @desc    Get all contact messages
// @route   GET /api/contact/messages
// @access  Private (Admin)
const getAllMessages = async (req, res) => {
    try {
        const [messages] = await db.query('SELECT * FROM contact_messages ORDER BY received_at DESC');
        res.status(200).json(messages);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve messages.' });
    }
};


// @desc    Delete a contact message
// @route   DELETE /api/contact/messages/:id
// @access  Private (Admin)
const deleteMessage = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM contact_messages WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Message not found.' });
        }
        res.status(200).json({ status: 'success', message: 'Message deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete message.' });
    }
};

module.exports = { submitContactMessage, getAllMessages, deleteMessage };