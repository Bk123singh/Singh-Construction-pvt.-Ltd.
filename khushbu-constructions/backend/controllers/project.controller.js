const Project = require('../models/Project.model');
const { cloudinary } = require('../config/cloudinary');

// @desc Get all projects
// @route GET /api/projects
const getProjects = async (req, res) => {
  try {
    const { status, category, featured, page = 1, limit = 20 } = req.query;
    const filter = {};
    if (status) filter.status = status;
    if (category) filter.category = category;
    if (featured) filter.featured = featured === 'true';

    const total = await Project.countDocuments(filter);
    const projects = await Project.find(filter)
      .sort({ order: 1, createdAt: -1 })
      .limit(parseInt(limit))
      .skip((parseInt(page) - 1) * parseInt(limit));

    res.json({ success: true, data: projects, total, page: parseInt(page), pages: Math.ceil(total / limit) });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Get single project
// @route GET /api/projects/:id
const getProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });
    res.json({ success: true, data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Create project
// @route POST /api/projects
const createProject = async (req, res) => {
  try {
    const { title, description, location, area, category, status, completionYear, client, featured, order } = req.body;
    const images = req.files ? req.files.map(f => ({ url: f.path, publicId: f.filename })) : [];

    const project = await Project.create({
      title, description, location, area, category, status,
      completionYear, client, featured, order, images
    });

    res.status(201).json({ success: true, message: 'Project created successfully', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Update project
// @route PUT /api/projects/:id
const updateProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const updates = { ...req.body };
    if (req.files && req.files.length > 0) {
      const newImages = req.files.map(f => ({ url: f.path, publicId: f.filename }));
      updates.images = [...(project.images || []), ...newImages];
    }

    const updated = await Project.findByIdAndUpdate(req.params.id, updates, { new: true, runValidators: true });
    res.json({ success: true, message: 'Project updated successfully', data: updated });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Delete project
// @route DELETE /api/projects/:id
const deleteProject = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    // Delete images from cloudinary
    for (const img of project.images) {
      if (img.publicId) {
        await cloudinary.uploader.destroy(img.publicId).catch(() => {});
      }
    }

    await project.deleteOne();
    res.json({ success: true, message: 'Project deleted successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// @desc Remove specific image from project
// @route DELETE /api/projects/:id/images/:imageId
const removeProjectImage = async (req, res) => {
  try {
    const project = await Project.findById(req.params.id);
    if (!project) return res.status(404).json({ success: false, message: 'Project not found' });

    const image = project.images.find(img => img._id.toString() === req.params.imageId);
    if (image && image.publicId) {
      await cloudinary.uploader.destroy(image.publicId).catch(() => {});
    }

    project.images = project.images.filter(img => img._id.toString() !== req.params.imageId);
    await project.save();

    res.json({ success: true, message: 'Image removed', data: project });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

module.exports = { getProjects, getProject, createProject, updateProject, deleteProject, removeProjectImage };
