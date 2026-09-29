require('dotenv').config({ path: __dirname + '/.env' });
const express = require('express');
const cors = require('cors');
const path = require('path');
const connectDB = require('./config/db');
const seedData = require('./utils/seedData');

const authRoutes = require('./routes/authRoutes');
const traineeRoutes = require('./routes/traineeRoutes');
const trainerRoutes = require('./routes/trainerRoutes');
const adminRoutes = require('./routes/adminRoutes');
const courseRoutes = require('./routes/courseRoutes');
const assessmentRoutes = require('./routes/assessmentRoutes');
const aiRoutes = require('./routes/aiRoutes');
const trainerAppRoutes = require('./routes/trainerApplicationRoutes');
const assignmentRoutes = require('./routes/assignmentRoutes');

const app = express();

// Enable CORS & JSON Parsing
app.use(cors());
app.use(express.json());

const mongoose = require('mongoose');

// Ensure database connection middleware
app.use(async (req, res, next) => {
  if (req.path.startsWith('/api') && mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }
  next();
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/trainee', traineeRoutes);
app.use('/api/trainer', trainerRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/courses', courseRoutes);
app.use('/api/assessments', assessmentRoutes);
app.use('/api/ai', aiRoutes);
app.use('/api/trainer-applications', trainerAppRoutes);
app.use('/api/assignments', assignmentRoutes);

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', service: 'CAPACITY CONNECT API', timestamp: new Date() });
});

// Serve Static Frontend Assets (Single Origin Localhost / Standalone mode)
const clientDistPath = path.join(__dirname, '../client/dist');
app.use(express.static(clientDistPath));

// Fallback to index.html for React Router single-page app navigation
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ message: 'API endpoint not found' });
  }
  res.sendFile(path.join(clientDistPath, 'index.html'));
});

const PORT = process.env.PORT || 5001;

if (require.main === module) {
  connectDB().then(async () => {
    await seedData();
    app.listen(PORT, () => {
      console.log(`====================================================`);
      console.log(`🚀 CAPACITY CONNECT Full-Stack App running on http://localhost:${PORT}`);
      console.log(`====================================================`);
    });
  }).catch(err => {
    console.error('Failed to start server:', err);
  });
}

module.exports = app;
