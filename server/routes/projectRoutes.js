const router = require('express').Router();
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

//create a new project
router.post('/create-project', authMiddleware, async (req, res) => {
  try {
    const newProject = new Project(req.body);
    await newProject.save();
    res.send({
      success: true,
      data: newProject,
      message: 'Project created successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

//get all projects
router.post('/get-all-projects', authMiddleware, async (req, res) => {
  try {
    const filters = req.query.filters;
    const projects = await Project.find(filters || {}).sort({ createdAt: -1 });
    res.send({
      success: true,
      data: projects,
      message: 'Projects fetched successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

// get project by id
router.post('/get-project-by-id', authMiddleware, async (req, res) => {
  try {
    const projectId = req.body._id;
    const project = await Project.findById(projectId).populate('owner').populate('members.user');
    if (!project) {
      throw new Error('Project not found');
    }
    res.send({
      success: true,
      data: project,
      message: 'Project fetched successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

// get project by role
router.post('/get-projects-by-role', authMiddleware, async (req, res) => {
  try {
    const userId = req.body.userId;
    const projects = await Project.find({ 'members.user': userId }).sort({
      createdAt: -1,
    }).populate('owner');
    res.send({
      success: true,
      data: projects,
      message: 'Projects fetched successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

// edit project
router.post('/edit-project', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndUpdate(req.body._id, req.body);
    if (!project) {
      throw new Error('Project not found');
    }
    res.send({
      success: true,
      data: project,
      message: 'Project updated successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

// delete project
router.post('/delete-project', authMiddleware, async (req, res) => {
  try {
    const project = await Project.findByIdAndDelete(req.body._id);
    if (!project) {
      throw new Error('Project not found');
    }
    res.send({
      success: true,
      data: project,
      message: 'Project deleted successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

// add member to project
router.post('/add-member', authMiddleware, async (req, res) => {
  try {
    const { email, role, projectId } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      res.send({
        success: false,
        message: 'User does not exist',
        status: 500,
      });
    }
    await Project.findByIdAndUpdate(projectId, {
      $push: {
        members: {
          user: user._id,
          role,
        },
      },
    });
    res.send({
      success: true,
      message: 'Member added successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      error: err.message,
      status: 500,
    })
  }
});

module.exports = router;