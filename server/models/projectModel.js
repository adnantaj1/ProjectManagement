const mongoose = require('mongoose');

const membersSchema = new mongoose.Schema({
  user: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  role: {
    type: String,
    required: true,
  },
});

const projectSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  status: {
    type: String,
    required: true,
    default: 'active',
  },
  owner: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  members: [membersSchema],
}, {
  timestamps: true, // Enable automatic timestamps
});

module.exports = mongoose.model('Project', projectSchema);
