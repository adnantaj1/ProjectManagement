const router = require('express').Router();

const Task = require('../models/taskModel');
const authMiddleware = require('../middlewares/authMiddleware');
const cloudinary = require('../config/cloudinaryConfig');
const multer = require('multer');

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
    Object.keys(req.body).forEach((key) => {
      if (req.body[key] === 'all') {
        delete req.body[key];
      }
    })
    delete req.body['userId'];
    const tasks = await Task.find(req.body)
      .populate('assignedTo')
      .populate('assignedBy')
      .populate('project').sort({ createdAt: -1 });
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

//update a task
router.post('/update-task', authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndUpdate(req.body._id, req.body);
    res.send({
      success: true,
      message: 'Task updated successfully',
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

//delete a task
router.post('/delete-task', authMiddleware, async (req, res) => {
  try {
    await Task.findByIdAndDelete(req.body._id);
    res.send({
      success: true,
      message: 'Task deleted successfully',
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

// create multer storage
const storage = multer.diskStorage({
  filename: function (req, file, cb) {
    cb(null, Date.now() + file.originalname);
  },
});

router.post("/upload-image", authMiddleware, multer({ storage: storage }).single("file"), async (req, res) => {
  console.log(req.file);
  console.log(req.body);
  if (!req.file) {
    return res.status(400).send({
      success: false,
      message: "No file uploaded"
    });
  }
  try {
    const result = await cloudinary.uploader.upload(req.file.path, {
      folder: "tasks",
    });
    const imageURL = result.secure_url;

    await Task.findOneAndUpdate(
      { _id: req.body.taskId },
      {
        $push: {
          attachments: imageURL,
        },
      }
    );

    res.send({
      success: true,
      message: "Image uploaded successfully",
      data: imageURL,
      status: 200,
    });
  } catch (error) {
    res.send({
      success: false,
      message: error.message,
      status: 500,
    });
  }
});

module.exports = router;