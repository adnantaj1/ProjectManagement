const router = require('express').Router();
const Project = require('../models/projectModel');
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
    const projects = await Project.find(filters || {});
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

module.exports = router;