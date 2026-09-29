const mongoose = require('mongoose');

const TrainerApplicationSchema = new mongoose.Schema({
  applicant: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  fullName: { type: String, required: true },
  email: { type: String, required: true },
  photo: { type: String, default: '' },
  phone: { type: String, default: '' },
  location: { type: String, default: '' },
  
  // Qualifications & Experience
  highestQualification: { type: String, required: true },
  institution: { type: String, required: true },
  experienceYears: { type: Number, required: true },
  currentOrganization: { type: String, required: true },
  
  // Credentials & Portfolio
  resumeUrl: { type: String, required: true },
  linkedinUrl: { type: String, required: true },
  githubUrl: { type: String, default: '' },
  portfolioUrl: { type: String, default: '' },

  // Domain Expertise
  expertiseAreas: [{ type: String }],
  skills: [{ type: String }],
  certifications: [{ type: String }],
  achievements: [{ type: String }],
  teachingExperience: { type: String, required: true },
  publications: { type: mongoose.Schema.Types.Mixed, default: [] },

  // Application Status
  status: { 
    type: String, 
    enum: ['PENDING', 'APPROVED', 'REJECTED'], 
    default: 'PENDING' 
  },
  adminFeedback: { type: String, default: '' },
  appliedAt: { type: Date, default: Date.now },
  reviewedAt: { type: Date }
});

module.exports = mongoose.model('TrainerApplication', TrainerApplicationSchema);
