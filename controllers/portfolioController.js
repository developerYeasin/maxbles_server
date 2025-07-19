// controllers/portfolioController.js
const db = require('../config/db');
const { v4: uuidv4 } = require('uuid');
const slugify = require('slugify');
const { sendNotification } = require('../config/webpush');

// @desc    Get all portfolio items with optional filters
// @route   GET /api/portfolio-items
// @access  Public
const getAllPortfolioItems = async (req, res) => {
    try {
        const { limit, offset, category, type } = req.query;
        let query = 'SELECT * FROM portfolio_items WHERE 1=1';
        const queryParams = [];
        
        if (category) {
            query += ' AND category = ?';
            queryParams.push(category);
        }
        
        if (type) {
            query += ' AND type = ?';
            queryParams.push(type);
        }
        
        query += ' ORDER BY created_at DESC';
        
        if (limit) {
            query += ' LIMIT ?';
            queryParams.push(parseInt(limit, 10));
        }
        
        if (offset) {
            query += ' OFFSET ?';
            queryParams.push(parseInt(offset, 10));
        }
        
        console.log(query);
        const [items] = await db.query(query, queryParams);
        // MySQL stores JSON as strings, so we parse it back
        const parsedItems = items.map(item => {
            try {
                return {...item, tags: JSON.parse(item.tags)};
            } catch (error) {
                console.error("Failed to parse tags for item:", item.id, error);
                return {...item, tags: []};
            }
        });

        res.status(200).json(parsedItems);
    } catch (error) {
        console.log("error >> ", error);
        res.status(400).json({ status: 'error', message: 'Failed to retrieve portfolio items.' });
    }
};

// @desc    Get single portfolio item by slug
// @route   GET /api/portfolio-items/:slug
// @access  Public
const getPortfolioItemBySlug = async (req, res) => {
    try {
        const { slug } = req.params;
        const [items] = await db.query('SELECT * FROM portfolio_items WHERE slug = ?', [slug]);

        if (items.length === 0) {
            return res.status(404).json({ status: 'error', message: 'Portfolio item not found.' });
        }
        
        let item = items[0];
        try {
            item = {...item, tags: JSON.parse(item.tags)};
        } catch (error) {
            console.error("Failed to parse tags for item:", item.id, error);
            item = {...item, tags: []};
        }
        res.status(200).json(item);
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to retrieve portfolio item.' });
    }
};

// @desc    Create a new portfolio item
// @route   POST /api/portfolio-items
// @access  Private (Admin)
const createPortfolioItem = async (req, res) => {
    const { title, category, type, live_url, github_url, image, description, full_content, tags } = req.body;
    
    try {
        const newItem = {
            id: uuidv4(),
            slug: slugify(title, { lower: true, strict: true }),
            title,
            category,
            type,
            live_url,
            github_url,
            image,
            description,
            full_content,
            tags: JSON.stringify(tags || []),
        };

        await db.query('INSERT INTO portfolio_items SET ?', newItem);

        const [subscriptions] = await db.query('SELECT * FROM push_subscriptions');
        const notificationPayload = {
            title: 'New Portfolio Item!',
            body: title,
            icon: 'path_to_icon',
            data: {
                url: `/portfolio/${newItem.slug}`
            }
        };

        for (const subscription of subscriptions) {
            const sub = {
                endpoint: subscription.endpoint,
                keys: {
                    p256dh: subscription.p256dh,
                    auth: subscription.auth
                }
            };
            await sendNotification(sub, notificationPayload);
        }

        res.status(201).json({...newItem, tags: tags || []}); // Return parsed tags
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to create portfolio item.', error: error.message });
    }
};

// @desc    Update a portfolio item by ID
// @route   PUT /api/portfolio-items/:id
// @access  Private (Admin)
const updatePortfolioItem = async (req, res) => {
    const { id } = req.params;
    const { title, category, type, live_url, github_url, image, description, full_content, tags } = req.body;
    
    try {
        const updateData = {
            title,
            slug: slugify(title, { lower: true, strict: true }),
            category,
            type,
            live_url,
            github_url,
            image,
            description,
            full_content,
            tags: JSON.stringify(tags || []),
            updated_at: new Date()
        };
        
        const [result] = await db.query('UPDATE portfolio_items SET ? WHERE id = ?', [updateData, id]);

        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Portfolio item not found.' });
        }
        res.status(200).json({ id, ...updateData, tags: tags || [] });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to update portfolio item.', error: error.message });
    }
};


// @desc    Delete a portfolio item by ID
// @route   DELETE /api/portfolio-items/:id
// @access  Private (Admin)
const deletePortfolioItem = async (req, res) => {
    const { id } = req.params;
    try {
        const [result] = await db.query('DELETE FROM portfolio_items WHERE id = ?', [id]);
        if (result.affectedRows === 0) {
            return res.status(404).json({ status: 'error', message: 'Message not found.' });
        }
        res.status(200).json({ status: 'success', message: 'Message deleted successfully.' });
    } catch (error) {
        res.status(500).json({ status: 'error', message: 'Failed to delete message.' });
    }
};

module.exports = {
    getAllPortfolioItems,
    getPortfolioItemBySlug,
    createPortfolioItem,
    updatePortfolioItem,
    deletePortfolioItem
};