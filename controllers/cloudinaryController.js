// Cloudinary upload controller
const { v2: cloudinary } = require('cloudinary');
const dotenv = require('dotenv');

dotenv.config();

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME || 'dbk7ixyvd',
  api_key: process.env.CLOUDINARY_API_KEY || '165423711569475',
  api_secret: process.env.CLOUDINARY_API_SECRET || 'AqHdTNx6lgLc3rfHvSGcBZE9Z8k',
});

const uploadImageToCloudinary = async (req, res) => {
  try {
    // Accept file from multipart/form-data
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded' });
    }
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: req.body.folder || 'uploads',
      public_id: req.body.public_id || undefined,
    });
    return res.status(200).json({ url: result.secure_url, public_id: result.public_id });
  } catch (error) {
    return res.status(500).json({ error: error.message });
  }
};

module.exports = {
  uploadImageToCloudinary,
};
