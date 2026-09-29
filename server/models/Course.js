const mongoose = require('mongoose');

const CourseSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  category: { type: String, required: true },
  difficulty: { type: String, enum: ['Beginner', 'Intermediate', 'Advanced'], default: 'Intermediate' },
  trainer: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  trainerName: { type: String, default: 'Dr. Ananya Sharma' },
  duration: { type: String, default: '4 Weeks' },
  learningObjectives: [{ type: String }],
  
  // Modules
  modules: [{
    title: String,
    description: String
  }],

  // Lectures
  lectures: [{
    title: String,
    videoUrl: String,
    duration: String,
    summary: String
  }],

  // Classroom Materials (Video, PDF, PPT, Document, External Link)
  materials: [{
    title: String,
    description: String,
    fileUrl: String,
    fileType: { type: String, enum: ['Video', 'PDF', 'PPT', 'Document', 'External Link'], default: 'PDF' },
    moduleName: String,
    dateAdded: { type: Date, default: Date.now }
  }],

  // Classroom Stream Announcements
  announcements: [{
    title: String,
    content: String,
    authorName: String,
    createdAt: { type: Date, default: Date.now }
  }],

  assessment: { type: mongoose.Schema.Types.ObjectId, ref: 'Assessment' },
  enrollmentsCount: { type: Number, default: 0 },
  completionRate: { type: Number, default: 85 },
  competencyTags: [{ type: String }],
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Course', CourseSchema);
