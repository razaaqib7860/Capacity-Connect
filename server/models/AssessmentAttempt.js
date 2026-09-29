const mongoose = require('mongoose');

const AssessmentAttemptSchema = new mongoose.Schema({
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  answers: [{ type: Number }], // index of option selected per question
  score: { type: Number, required: true },
  totalMarks: { type: Number, required: true },
  percentage: { type: Number, required: true },
  passed: { type: Boolean, required: true },
  attemptedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('AssessmentAttempt', AssessmentAttemptSchema);
