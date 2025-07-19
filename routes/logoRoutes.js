// routes/logoRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllLogos,
    getLogoById,
    createLogo,
    updateLogo,
    deleteLogo
} = require('../controllers/logoController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.get('/logos', getAllLogos);
router.get('/logos/:id', getLogoById);

// Admin Only Routes
router.post('/logos', protect, createLogo);
router.put('/logos/:id', protect, updateLogo);
router.delete('/logos/:id', protect, deleteLogo);

module.exports = router;