const mongoose = require('mongoose');

const AnnouncementSchema = new mongoose.Schema({
  title: { type: String, required: true },
  content: { type: String, required: true },
  author: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  authorName: { type: String, default: 'System Administrator' },
  category: { type: String, default: 'Platform Update' },
  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('Announcement', AnnouncementSchema);
