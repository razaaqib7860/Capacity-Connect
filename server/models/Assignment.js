const mongoose = require('mongoose');

const AssignmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  instructions: { type: String, required: true },
  attachedResources: [{
    title: String,
    url: String,
    type: { type: String } // PDF, Link, PPT, Code
  }],
  deadline: { type: Date, required: true },
  totalMarks: { type: Number, default: 100 },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assignment', AssignmentSchema);
