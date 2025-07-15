// routes/portfolioRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllPortfolioItems,
    getPortfolioItemBySlug,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
} = require('../controllers/portfolioController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.get('/portfolio-items', getAllPortfolioItems);
router.get('/portfolio-items/:slug', getPortfolioItemBySlug);

// Admin Only Routes
router.post('/portfolio-items', protect, createPortfolioItem);
router.put('/portfolio-items/:id', protect, updatePortfolioItem);
router.delete('/portfolio-items/:id', protect, deletePortfolioItem);


module.exports = router;