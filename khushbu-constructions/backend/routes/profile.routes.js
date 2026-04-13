const express = require('express');
const router = express.Router();
const { getProfile, updateProfile, updateStatistics } = require('../controllers/profile.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');

router.get('/', getProfile);
router.put('/', protect, adminOnly, updateProfile);
router.put('/statistics', protect, adminOnly, updateStatistics);

module.exports = router;
