const mongoose = require('mongoose');

const CompetencySchema = new mongoose.Schema({
  title: { type: String, required: true, unique: true }, // e.g. "Technical Project Lead", "Cloud Solutions Specialist", "DevOps Engineer"
  description: { type: String, required: true },
  category: { type: String, default: 'Engineering Leadership' },
  requiredSkills: [{
    skill: { type: String, required: true },
    requiredLevel: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
    targetScore: { type: Number, default: 80 }
  }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Competency', CompetencySchema);
