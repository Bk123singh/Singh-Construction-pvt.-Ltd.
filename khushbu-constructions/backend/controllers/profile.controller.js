const Profile = require('../models/Profile.model');
const { cloudinary } = require('../config/cloudinary');

const getProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = await Profile.create({});
    res.json({ success: true, data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateProfile = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();

    const allowedFields = ['companyName', 'tagline', 'description', 'mission', 'vision',
      'email', 'phone', 'whatsapp', 'address', 'mapUrl', 'socialLinks'];

    allowedFields.forEach(field => {
      if (req.body[field] !== undefined) {
        if (field === 'socialLinks' && typeof req.body[field] === 'string') {
          profile[field] = JSON.parse(req.body[field]);
        } else {
          profile[field] = req.body[field];
        }
      }
    });

    await profile.save();
    res.json({ success: true, message: 'Profile updated', data: profile });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

const updateStatistics = async (req, res) => {
  try {
    let profile = await Profile.findOne();
    if (!profile) profile = new Profile();
    const { experienceYears, completedProjects, happyClients, employees } = req.body;
    profile.statistics = { experienceYears, completedProjects, happyClients, employees };
    await profile.save();
    res.json({ success: true, message: 'Statistics updated', data: profile.statistics });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProfile, updateProfile, updateStatistics };
