const router = require('express').Router();
const User = require('../models/userModel');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const authMiddleware = require('../middlewares/authMiddleware');

// Register User 
router.post('/register', async (req, res) => {
  const { firstName, lastName, email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (user) {
      throw new Error('User already exists');
    }
    const newUser = new User({ firstName, lastName, email, password });
    const salt = await bcrypt.genSalt(10);
    newUser.password = await bcrypt.hash(password, salt);
    await newUser.save();
    res.send({
      success: true,
      message: 'User registered successfully'
    });
  } catch (err) {
    res.send({
      success: false,
      message: err.message,
      status: 500,
    })
  }
});

// Login User
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      throw new Error('User does not exist');
    }
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      throw new Error('Invalid password');
    }
    // create and assign a token
    const token = jwt.sign({ userId: user._id }, process.env.JWT_SECRET, { expiresIn: '1d' });
    res.send({
      success: true,
      data: token,
      message: 'User logged in successfully',
      status: 200,
    })
  } catch (err) {
    res.send({
      success: false,
      message: err.message
    })
  }
});

// get logged in user
router.get('/me', authMiddleware, async (req, res) => {
  try {
    const user = await User.findById(req.body.userId);
    // remove the password from the user object
    user.password = undefined;
    res.send({
      success: true,
      data: user,
      message: 'User fetched successfully',
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

// Check if email exists
router.post('/check-email', async (req, res) => {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (user) {
      return res.status(200).send({
        success: true,
        exists: true,
        message: 'Email exists',
      });
    }
    return res.status(404).send({
      success: false,
      exists: false,
      message: 'Email does not exist',
    });
  } catch (err) {
    res.status(500).send({
      success: false,
      message: 'Internal server error'
    });
  }
});


module.exports = router;