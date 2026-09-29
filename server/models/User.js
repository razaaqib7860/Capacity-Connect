const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { 
    type: String, 
    enum: ['trainee', 'trainer', 'admin'], 
    default: 'trainee' 
  },
  avatar: { type: String, default: '' },
  isApproved: { type: Boolean, default: true }, // Trainees true by default, Trainers need admin approval
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
