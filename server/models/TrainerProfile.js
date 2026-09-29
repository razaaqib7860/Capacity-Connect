const mongoose = require('mongoose');

const TrainerProfileSchema = new mongoose.Schema({
  user: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true, unique: true },
  title: { type: String, default: 'Senior Enterprise Cloud & DevOps Architect' },
  bio: { type: String, default: 'Specializing in Enterprise Cloud Migration, AWS Solutions Architecture, and Leadership for IT Transformation.' },
  expertise: [{ type: String }],
  subjects: [{ type: String }],
  qualifications: [{ type: String }],
  experienceYears: { type: Number, default: 12 },
  rating: { type: Number, default: 4.9 },
  totalStudents: { type: Number, default: 1420 },
  availabilityStatus: { type: String, enum: ['Available', 'Busy'], default: 'Available' },
  updatedAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('TrainerProfile', TrainerProfileSchema);
