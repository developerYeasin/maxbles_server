// controllers/testimonialController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');

// @desc    Get all testimonials
// @route   GET /api/testimonials
// @access  Public
const getAllTestimonials = async (req, res) => {
    try {
        const [testimonials] = await db.query('SELECT * FROM testimonials ORDER BY created_at DESC');
        res.status(200).json(testimonials);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve testimonials.' });
    }
};

// @desc    Create a new testimonial
// @route   POST /api/testimonials
// @access  Private (Admin)
const createTestimonial = async (req, res) => {
    const { quote, name, title, avatar } = req.body;
    if (!quote || !name || !title) {
        return res.status(400).json({ status: 'error', message: 'Quote, name, and title are required.' });
    }

    try {
        const newTestimonial = {
            id: uuidv4(),
            quote,
            name,
            title,
            avatar
        };
        await db.query('INSERT INTO testimonials SET ?', newTestimonial);
        res.status(201).json(newTestimonial);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create testimonial.', error: error.message });
    }
};

// @desc    Update a testimonial by ID
// @route   PUT /api/testimonials/:id
// @access  Private (Admin)
const updateTestimonial = async (req, res) => {
    const { id } = req.params;
    const { quote, name, title, avatar } = req.body;
    try {
        const updateData = { quote, name, title, avatar };
        const [result] = await db.query('UPDATE testimonials SET ? WHERE id = ?', [updateData, id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Testimonial not found.' });
        }
        res.status(200).json({ id, ...updateData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update testimonial.', error: error.message });
    }
};

// @desc    Delete a testimonial by ID
// @route   DELETE /api/testimonials/:id
// @access  Private (Admin)
const deleteTestimonial = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM testimonials WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Testimonial not found.' });
        }
        res.status(200).json({ status: 'success', message: 'Testimonial deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete testimonial.' });
    }
};

module.exports = {
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
};