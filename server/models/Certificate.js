const mongoose = require('mongoose');

const CertificateSchema = new mongoose.Schema({
  certificateNumber: { type: String, required: true, unique: true },
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  traineeName: { type: String, required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  courseTitle: { type: String, required: true },
  trainerName: { type: String, required: true },
  issueDate: { type: Date, default: Date.now },
  score: { type: Number, required: true },
  percentage: { type: Number, required: true },
  status: { type: String, default: 'VERIFIED' }
});

module.exports = mongoose.model('Certificate', CertificateSchema);
