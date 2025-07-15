// routes/testimonialRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllTestimonials,
    createTestimonial,
    updateTestimonial,
    deleteTestimonial
} = require('../controllers/testimonialController');
const { protect } = require('../middleware/authMiddleware');

// Public Route
router.get('/testimonials', getAllTestimonials);

// Admin Only Routes
router.post('/testimonials', protect, createTestimonial);
router.put('/testimonials/:id', protect, updateTestimonial);
router.delete('/testimonials/:id', protect, deleteTestimonial);

module.exports = router;