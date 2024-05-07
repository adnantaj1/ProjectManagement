const router = require('express').Router();

const Task = require('../models/taskModel');
const Project = require('../models/projectModel');
const User = require('../models/userModel');
const authMiddleware = require('../middlewares/authMiddleware');

//create a new task
router.post('/create-task', authMiddleware, async (req, res) => {
  try {
    const newTask = new Task(req.body);
    await newTask.save();
    res.send({
      success: true,
      data: newTask,
      message: 'Task created successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      message: 'There was an error creating the task',
      status: 500,
    })
  }
});

//get all tasks
router.post('/get-all-tasks', authMiddleware, async (req, res) => {
  try {
    const tasks = await Task.find(req.body.filters).populate('assignedTo').populate('assignedBy').populate('project');
    res.send({
      success: true,
      data: tasks,
      message: 'Tasks fetched successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      status: 500,
    })
  }
});

module.exports = router;