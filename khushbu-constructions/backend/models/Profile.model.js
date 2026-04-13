const mongoose = require('mongoose');

const profileSchema = new mongoose.Schema({
  companyName: {
    type: String,
    default: 'Khushbu Constructions Pvt. Ltd.'
  },
  tagline: {
    type: String,
    default: 'Building Dreams, Constructing Futures'
  },
  description: {
    type: String,
    default: 'A premier construction company delivering excellence in residential and commercial projects across India.'
  },
  mission: {
    type: String,
    default: 'To deliver high-quality construction projects with integrity, innovation, and excellence.'
  },
  vision: {
    type: String,
    default: 'To be the most trusted construction company in India, known for quality and reliability.'
  },
  email: {
    type: String,
    default: 'info@khushbuconstructions.com'
  },
  phone: {
    type: String,
    default: '+91 98765 43210'
  },
  whatsapp: {
    type: String,
    default: '919876543210'
  },
  address: {
    type: String,
    default: 'Plot No. 123, Industrial Area, Jodhpur, Rajasthan - 342001'
  },
  mapUrl: {
    type: String,
    default: 'https://maps.google.com/?q=Jodhpur,Rajasthan'
  },
  logo: {
    url: String,
    publicId: String
  },
  socialLinks: {
    facebook: String,
    instagram: String,
    linkedin: String,
    youtube: String
  },
  statistics: {
    experienceYears: { type: Number, default: 15 },
    completedProjects: { type: Number, default: 250 },
    happyClients: { type: Number, default: 500 },
    employees: { type: Number, default: 120 }
  }
}, { timestamps: true });

module.exports = mongoose.model('Profile', profileSchema);
