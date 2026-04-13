const cloudinary = require('cloudinary').v2;
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const multer = require('multer');

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET
});

const projectStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'khushbu-constructions/projects',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, height: 800, crop: 'limit', quality: 'auto' }]
  }
});

const galleryStorage = new CloudinaryStorage({
  cloudinary,
  params: {
    folder: 'khushbu-constructions/gallery',
    allowed_formats: ['jpg', 'jpeg', 'png', 'webp'],
    transformation: [{ width: 1200, quality: 'auto' }]
  }
});

const uploadProjectImages = multer({
  storage: projectStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).array('images', 10);

const uploadGalleryImage = multer({
  storage: galleryStorage,
  limits: { fileSize: 5 * 1024 * 1024 }
}).single('image');

module.exports = { cloudinary, uploadProjectImages, uploadGalleryImage };
