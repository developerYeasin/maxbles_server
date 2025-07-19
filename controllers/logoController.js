// controllers/logoController.js
const db = require('../config/db');

// @desc    Get all logos
// @route   GET /api/logos
// @access  Public
const getAllLogos = async (req, res) => {
    try {
        const [logos] = await db.query('SELECT * FROM logos ORDER BY created_at DESC');
        res.status(200).json(logos);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve logos.' });
    }
};

// @desc    Get single logo by ID
// @route   GET /api/logos/:id
// @access  Public
const getLogoById = async (req, res) => {
    try {
        const { id } = req.params;
        const [logos] = await db.query('SELECT * FROM logos WHERE id = ?', [id]);

        if (logos.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Logo not found.' });
        }
        res.status(200).json(logos[0]);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve logo.' });
    }
};

// @desc    Create a new logo
// @route   POST /api/logos
// @access  Private (Admin)
const createLogo = async (req, res) => {
    const { name, image_url, web_url } = req.body;
    try {
        const newLogo = {
            name,
            image_url,
            web_url
        };

        const [result] = await db.query('INSERT INTO logos SET ?', newLogo);
        res.status(201).json({ id: result.insertId, ...newLogo });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create logo.', error: error.message });
    }
};

// @desc    Update a logo by ID
// @route   PUT /api/logos/:id
// @access  Private (Admin)
const updateLogo = async (req, res) => {
    const { id } = req.params;
    const { name, image_url, web_url } = req.body;
    
    try {
        const updateData = {
            name,
            image_url,
            web_url
        };

        const [result] = await db.query('UPDATE logos SET ? WHERE id = ?', [updateData, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Logo not found.' });
        }
        res.status(200).json({ id, ...updateData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update logo.', error: error.message });
    }
};

// @desc    Delete a logo by ID
// @route   DELETE /api/logos/:id
// @access  Private (Admin)
const deleteLogo = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM logos WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Logo not found.' });
        }
        res.status(200).json({ status: 'success', message: 'Logo deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete logo.' });
    }
};

module.exports = {
    getAllLogos,
    getLogoById,
    createLogo,
    updateLogo,
    deleteLogo
};