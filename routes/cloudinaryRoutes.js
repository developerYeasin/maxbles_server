const express = require('express');
const multer = require('multer');
const { uploadImageToCloudinary } = require('../controllers/cloudinaryController.js');
const { protect } = require('../middleware/authMiddleware');

const router = express.Router();
const upload = multer({ dest: 'uploads/' });

router.post('/upload-image', protect, upload.single('image'), uploadImageToCloudinary);

module.exports = router;
