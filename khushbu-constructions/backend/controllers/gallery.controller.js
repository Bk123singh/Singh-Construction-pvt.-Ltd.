const Gallery = require('../models/Gallery.model');
const { cloudinary } = require('../config/cloudinary');

const getGallery = async (req, res) => {
  try {
    const { category, page = 1, limit = 30 } = req.query;
    const filter = category ? { category } : {};
    const total = await Gallery.countDocuments(filter);
    const images = await Gallery.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));
    res.json({ success: true, data: images, total });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ success: false, message: 'No image file provided' });
    const { caption, category, order } = req.body;
    const image = await Gallery.create({
      url: req.file.path,
      publicId: req.file.filename,
      caption,
      category: category || 'other',
      order: order || 0
    });
    res.status(201).json({ success: true, message: 'Image uploaded', data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const deleteImage = async (req, res) => {
  try {
    const image = await Gallery.findById(req.params.id);
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    if (image.publicId) {
      await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }
    await image.deleteOne();
    res.json({ success: true, message: 'Image deleted' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateImage = async (req, res) => {
  try {
    const image = await Gallery.findByIdAndUpdate(req.params.id, req.body, { new: true });
    if (!image) return res.status(404).json({ success: false, message: 'Image not found' });
    res.json({ success: true, data: image });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getGallery, uploadImage, deleteImage, updateImage };
