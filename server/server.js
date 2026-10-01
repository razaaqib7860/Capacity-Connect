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

const fs = require('fs');
const mongoose = require('mongoose');

// Ensure database connection middleware for all requests
app.use(async (req, res, next) => {
  if (mongoose.connection.readyState !== 1) {
    try {
      await connectDB();
    } catch (err) {
      console.error('Database connection error:', err);
    }
  }
  next();
});

// API Routes (mounted on both /api/* and /* for Vercel rewrite compatibility)
app.use(['/api/auth', '/auth'], authRoutes);
app.use(['/api/trainee', '/trainee'], traineeRoutes);
app.use(['/api/trainer', '/trainer'], trainerRoutes);
app.use(['/api/admin', '/admin'], adminRoutes);
app.use(['/api/courses', '/courses'], courseRoutes);
app.use(['/api/assessments', '/assessments'], assessmentRoutes);
app.use(['/api/ai', '/ai'], aiRoutes);
app.use(['/api/trainer-applications', '/trainer-applications'], trainerAppRoutes);
app.use(['/api/assignments', '/assignments'], assignmentRoutes);

// Health check endpoint
app.get(['/api/health', '/health'], (req, res) => {
  res.json({ status: 'ok', service: 'CAPACITY CONNECT API', timestamp: new Date() });
});

// Serve Static Frontend Assets (Single Origin Localhost / Standalone mode)
const clientDistPath = path.join(__dirname, '../client/dist');
if (fs.existsSync(clientDistPath)) {
  app.use(express.static(clientDistPath));
}

// Fallback handler
app.use((req, res) => {
  const indexPath = path.join(clientDistPath, 'index.html');
  if (fs.existsSync(indexPath)) {
    return res.sendFile(indexPath);
  }
  res.status(404).json({ message: 'Endpoint not found' });
});

// Global Error Handler - Guarantee JSON output on unexpected errors
app.use((err, req, res, next) => {
  console.error('Express Error Handler:', err);
  res.status(err.status || 500).json({
    message: err.message || 'Internal Server Error'
  });
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
