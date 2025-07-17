// server.js
require('dotenv').config();
const express = require('express');
const cors = require('cors');

// Import routes
const blogRoutes = require('./routes/blogRoutes');
const portfolioRoutes = require('./routes/portfolioRoutes');
const contactRoutes = require('./routes/contactRoutes');
const adminRoutes = require('./routes/adminRoutes');
const testimonialRoutes = require('./routes/testimonialRoutes');
const cloudinaryRoutes = require('./routes/cloudinaryRoutes');

const app = express();
const PORT = process.env.PORT || 3034;

// Middleware
app.use(cors()); // Enable CORS for all routes
app.use(express.json()); // To parse JSON request bodies

// API Routes
app.use('/api', blogRoutes);
app.use('/api', portfolioRoutes);
app.use('/api', contactRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api', testimonialRoutes);
app.use('/api', cloudinaryRoutes);

// Simple root route
app.get('/', (req, res) => {
    res.send('Maxbles Digital Agency API is running...');
});

// Global error handler
app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).send({ status: 'error', message: 'Something went wrong!' });
});

app.listen(PORT, () => {
    console.log(`🚀 Server is running on http://localhost:${PORT}`);
});