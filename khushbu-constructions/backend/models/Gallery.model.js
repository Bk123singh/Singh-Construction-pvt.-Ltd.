const mongoose = require('mongoose');

const gallerySchema = new mongoose.Schema({
  url: {
    type: String,
    required: [true, 'Image URL is required']
  },
  publicId: {
    type: String,
    required: true
  },
  caption: {
    type: String,
    trim: true,
    maxlength: [200, 'Caption cannot exceed 200 characters']
  },
  category: {
    type: String,
    enum: ['residential', 'commercial', 'industrial', 'infrastructure', 'team', 'other'],
    default: 'other'
  },
  order: {
    type: Number,
    default: 0
  }
}, { timestamps: true });

module.exports = mongoose.model('Gallery', gallerySchema);
