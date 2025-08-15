const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary'); // ✅ import it here
const cloudinary = require('cloudinary').v2;
require('dotenv').config();


cloudinary.config({
  cloud_name: process.env.CLOUD_NAME,
  api_key: process.env.CLOUD_API_KEY,
  api_secret: process.env.CLOUD_API_SECRET
});

const storage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'StaySphere_dev',
    allowed_formats: ['jpg', 'png', 'jpeg'], // ✅ correct key in v5
  },
});

module.exports = { cloudinary, storage, };