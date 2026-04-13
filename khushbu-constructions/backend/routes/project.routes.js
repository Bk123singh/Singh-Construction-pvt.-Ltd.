const express = require('express');
const router = express.Router();
const {
  getProjects, getProject, createProject, updateProject, deleteProject, removeProjectImage
} = require('../controllers/project.controller');
const { protect, adminOnly } = require('../middleware/auth.middleware');
const { uploadProjectImages } = require('../config/cloudinary');

router.get('/', getProjects);
router.get('/:id', getProject);
router.post('/', protect, adminOnly, uploadProjectImages, createProject);
router.put('/:id', protect, adminOnly, uploadProjectImages, updateProject);
router.delete('/:id', protect, adminOnly, deleteProject);
router.delete('/:id/images/:imageId', protect, adminOnly, removeProjectImage);

module.exports = router;
