// controllers/blogController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');

// @desc    Get all blog posts with optional query params
// @route   GET /api/blog-posts
// @access  Public
const getAllBlogPosts = async (req, res) => {
    try {
        const { limit, offset, sortBy = 'date', order = 'desc' } = req.query;

        let query = 'SELECT * FROM blog_posts';
        const queryParams = [];

        // Simple validation for sortBy to prevent SQL injection
        const allowedSortBy = ['date', 'title', 'created_at'];
        if (allowedSortBy.includes(sortBy)) {
            query += ` ORDER BY ${sortBy}`;
        } else {
            query += ` ORDER BY date`; // Default sort
        }

        // Simple validation for order
        if (order.toLowerCase() === 'asc' || order.toLowerCase() === 'desc') {
            query += ` ${order.toUpperCase()}`;
        } else {
            query += ` DESC`; // Default order
        }

        if (limit) {
            query += ' LIMIT ?';
            queryParams.push(parseInt(limit, 10));
        }

        if (offset) {
            query += ' OFFSET ?';
            queryParams.push(parseInt(offset, 10));
        }

        const [posts] = await db.query(query, queryParams);
        res.status(200).json(posts);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve blog posts.' });
    }
};

// @desc    Get single blog post by slug
// @route   GET /api/blog-posts/:slug
// @access  Public
const getBlogPostBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [posts] = await db.query('SELECT * FROM blog_posts WHERE slug = ?', [slug]);

        if (posts.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Blog post not found.' });
        }
        res.status(200).json(posts[0]);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve blog post.' });
    }
};

// @desc    Create a new blog post
// @route   POST /api/blog-posts
// @access  Private (Admin)
const createBlogPost = async (req, res) => {
    const { title, excerpt, content, image, author, read_time } = req.body;
    try {
        const newPost = {
            id: uuidv4(),
            slug: slugify(title, { lower: true, strict: true }),
            title,
            date: new Date(),
            excerpt,
            content,
            image,
            author,
            read_time
        };

        await db.query('INSERT INTO blog_posts SET ?', newPost);
        res.status(201).json(newPost);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create blog post.', error: error.message });
    }
};

// @desc    Update a blog post by ID
// @route   PUT /api/blog-posts/:id
// @access  Private (Admin)
const updateBlogPost = async (req, res) => {
    const { id } = req.params;
    const { title, excerpt, content, image, author, read_time } = req.body;
    
    try {
        const updateData = {
            title,
            slug: slugify(title, { lower: true, strict: true }),
            excerpt,
            content,
            image,
            author,
            read_time: readTime,
            updated_at: new Date()
        };

        const [result] = await db.query('UPDATE blog_posts SET ? WHERE id = ?', [updateData, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Blog post not found.' });
        }
        res.status(200).json({ id, ...updateData });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update blog post.', error: error.message });
    }
};

// @desc    Delete a blog post by ID
// @route   DELETE /api/blog-posts/:id
// @access  Private (Admin)
const deleteBlogPost = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM blog_posts WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Blog post not found.' });
        }
        res.status(200).json({ status: 'success', message: 'Blog post deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete blog post.' });
    }
};

module.exports = {
    getAllBlogPosts,
    getBlogPostBySlug,
    createBlogPost,
    updateBlogPost,
    deleteBlogPost
};