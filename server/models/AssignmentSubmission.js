const mongoose = require('mongoose');

const AssignmentSubmissionSchema = new mongoose.Schema({
  assignment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assignment', required: true },
  course: { type: mongoose.Schema.Types.ObjectId, ref: 'Course', required: true },
  trainee: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  traineeName: { type: String, required: true },
  submissionText: { type: String, required: true },
  fileUrl: { type: String, default: '' },
  submittedAt: { type: Date, default: Date.now },
  status: { 
    type: String, 
    enum: ['Assigned', 'Submitted', 'Late', 'Evaluated'], 
    default: 'Submitted' 
  },
  marks: { type: Number, default: 0 },
  feedback: { type: String, default: '' }
});

module.exports = mongoose.model('AssignmentSubmission', AssignmentSubmissionSchema);
