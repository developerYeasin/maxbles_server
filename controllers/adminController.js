// controllers/adminController.js
const db = require('../config/db');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// @desc    Register a new admin
// @route   POST /api/admin/register
// @access  Public (should be protected or used for initial setup only)
const registerAdmin = async (req, res) => {
    const { user_name, password } = req.body;
        if (!user_name || !password) {
            return res.status(400).json({ message: 'Please provide username and password' });
        }

    try {
        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        const [result] = await db.query(
            'INSERT INTO admins (username, password) VALUES (?, ?)',
            [username, hashedPassword]
        );

        res.status(201).json({ id: result.insertId, user_name: username });
            } catch (error) {
                res.status(500).json({ message: 'Error registering admin', error: error.message });
            }
};

// @desc    Authenticate admin & get token
// @route   POST /api/admin/login
// @access  Public
const loginAdmin = async (req, res) => {
    const { user_name, password } = req.body;
        try {
            const [rows] = await db.query('SELECT * FROM admins WHERE username = ?', [user_name]);

        if (rows.length > 0 && (await bcrypt.compare(password, rows[0].password))) {
            res.json({
                message: 'Login successful',
                token: jwt.sign({ id: rows[0].id, user_name: rows[0].username }, process.env.JWT_SECRET, {
                                    expiresIn: '1d', // Token expires in 1 day
                                }),
                            });
                        } else {
                            res.status(401).json({ message: 'Invalid credentials' });
        }
    } catch (error) {
        res.status(500).json({ message: 'Server error', error: error.message });
    }
};

module.exports = { registerAdmin, loginAdmin };