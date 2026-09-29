const mongoose = require('mongoose');

const AssessmentSchema = new mongoose.Schema({
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  title: { type: String, required: true },
  subject: { type: String, required: true },
  durationMinutes: { type: Number, default: 30 },
  totalMarks: { type: Number, default: 100 },
  passPercentage: { type: Number, default: 70 },
  questions: [{
    questionText: { type: String, required: true },
    options: [{ type: String, required: true }],
    correctOptionIndex: { type: Number, required: true },
    marks: { type: Number, default: 20 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Assessment', AssessmentSchema);
