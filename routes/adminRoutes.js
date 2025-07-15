// routes/adminRoutes.js
const express = require('express');
const router = express.Router();
const { registerAdmin, loginAdmin } = require('../controllers/adminController');

router.post('/register', registerAdmin); // Use this once to create your admin user
router.post('/login', loginAdmin);

module.exports = router;