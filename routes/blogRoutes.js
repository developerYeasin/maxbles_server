// routes/blogRoutes.js
const express = require('express');
const router = express.Router();
const {
    getAllBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
} = require('../controllers/blogController');
const { protect } = require('../middleware/authMiddleware');

// Public Routes
router.get('/blog-posts', getAllBlogPosts);
router.get('/blog-posts/:slug', getBlogPostBySlug);

// Admin Only Routes
router.post('/blog-posts', protect, createBlogPost);
router.put('/blog-posts/:id', protect, updateBlogPost);
router.delete('/blog-posts/:id', protect, deleteBlogPost);

module.exports = router;