const router = require('express').Router();

const Notification = require('../models/notificationModel');
const authMiddleware = require('../middlewares/authMiddleware');

//add new notification
router.post('/add-notification', authMiddleware, async (req, res) => {
  try {
    const newNotification = new Notification(req.body);
    await newNotification.save();
    res.send({
      success: true,
      data: newNotification,
      message: 'Notification added successfully',
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

//get all notifications
router.get('/get-all-notifications', authMiddleware, async (req, res) => {
  try {
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({
      createdAt: -1,
    });
    res.send({
      success: true,
      data: notifications,
      message: 'Notifications fetched successfully',
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

//mark notification as read
router.post('/mark-as-read', authMiddleware, async (req, res) => {
  try {
    await Notification.updateMany({
      user: req.body.userId,
      read: false,
    }, {
      read: true,
    });
    const notifications = await Notification.find({
      user: req.body.userId,
    }).sort({ createdAt: -1 });
    res.send({
      success: true,
      message: 'Notifications marked as read successfully',
      data: notifications,
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

// delete all notifications
router.delete('/delete-all-notifications', authMiddleware, async (req, res) => {
  try {
    await Notification.deleteMany({
      user: req.body.userId,
    });
    res.send({
      success: true,
      message: 'All notifications deleted successfully',
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