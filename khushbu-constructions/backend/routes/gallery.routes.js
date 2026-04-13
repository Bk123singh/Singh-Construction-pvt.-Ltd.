const express = require('express');
const router = express.Router();
const { getGallery, uploadImage, deleteImage, updateImage } = require('../controllers/gallery.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadGalleryImage } = require('../config/cloudinary');

router.get('/', getGallery);
router.post('/', protect, adminOnly, uploadGalleryImage, uploadImage);
router.put('/:id', protect, adminOnly, updateImage);
router.delete('/:id', protect, adminOnly, deleteImage);

module.exports = router;
