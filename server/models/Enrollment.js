const mongoose = require('mongoose');

const EnrollmentSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  progress: { type: Number, default: 0 },
  completedLectures: [{ type: Number }],
  status: { type: String, enum: ['enrolled', 'completed'], default: 'enrolled' },
  enrolledAt: { type: Date, default: Date.now },
  completedAt: { type: Date }
});

module.exports = mongoose.model('Enrollment', EnrollmentSchema);
