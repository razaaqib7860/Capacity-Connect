const mongoose = require('mongoose');

const TraineeProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  headline: { type: String, default: 'Software Engineer & Aspiring Cloud Specialist' },
  phone: { type: String, default: '+91 9876543210' },
  location: { type: String, default: 'New Delhi, India' },
  organization: { type: String, default: 'National Infrastructure Agency' },
  department: { type: String, default: 'Digital Technology Division' },
  
  // Education & Experience
  highestQualification: { type: String, default: 'B.Tech in Computer Science' },
  institution: { type: String, default: 'IIT Delhi' },
  graduationYear: { type: Number, default: 2023 },
  currentRole: { type: String, default: 'Junior Software Engineer' },
  workExperience: [{
    title: String,
    company: String,
    duration: String,
    description: String
  }],
  
  // Social / Links / Resume
  resumeUrl: { type: String, default: 'https://capacityconnect.in/resumes/rahul_kumar_resume.pdf' },
  resumeText: { type: String, default: 'Proficient in Python, JavaScript, SQL, Git, REST APIs. Built microservices and databases.' },
  linkedinUrl: { type: String, default: 'https://linkedin.com/in/rahulkumar-demo' },
  githubUrl: { type: String, default: 'https://github.com/rahulkumar-demo' },
  portfolioUrl: { type: String, default: 'https://rahulkumar.dev' },

  // Skills & Interests
  currentSkills: [{
    skill: { type: String, required: true },
    level: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Beginner' },
    score: { type: Number, default: 40 }
  }],
  targetCompetency: { type: String, default: 'Technical Project Lead' },
  careerInterests: [{ type: String }],
  certifications: [{
    name: String,
    issuer: String,
    year: Number
  }],
  achievements: [{ type: String }],

  // Competency Analysis & Completion %
  profileCompletionPercentage: { type: Number, default: 95 },
  overallCompetencyScore: { type: Number, default: 72 },
  identifiedGaps: [{
    skill: String,
    gapLevel: { type: String, enum: ['HIGH GAP', 'MEDIUM GAP', 'LOW GAP'] },
    currentScore: Number,
    requiredScore: Number,
    description: String
  }],
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TraineeProfile', TraineeProfileSchema);
