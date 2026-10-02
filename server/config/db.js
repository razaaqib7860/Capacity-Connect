const mongoose = require('mongoose');
const seedData = require('../utils/seedData');

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  const DEFAULT_URI = 'mongodb+srv://razaaqib7860_db_user:jDrheaakP1wzKBf6@capacity.ssjb2pb.mongodb.net/?appName=capacity';
  const connUri = process.env.MONGODB_URI || DEFAULT_URI;

  mongoose.set('bufferCommands', false);

  try {
    console.log('Connecting to MongoDB Atlas...');
    cachedConnection = await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 8000
    });
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
    
    // Seed data asynchronously without blocking response
    seedData().catch(err => console.warn('Seed data warning:', err.message));
    return cachedConnection;
  } catch (err) {
    console.error('MongoDB Atlas connection error:', err.message);
    
    // Try fallback to local memory server ONLY in local development
    if (!process.env.VERCEL && process.env.NODE_ENV !== 'production') {
      try {
        const { MongoMemoryServer } = require('mongodb-memory-server');
        const mongoMemoryServer = await MongoMemoryServer.create();
        const memoryUri = mongoMemoryServer.getUri();
        cachedConnection = await mongoose.connect(memoryUri);
        console.log(`Connected to In-Memory MongoDB at: ${memoryUri}`);
        seedData().catch(err => console.warn('Seed data warning:', err.message));
        return cachedConnection;
      } catch (memErr) {
        console.error('In-memory MongoDB failed:', memErr.message);
      }
    }
    throw err;
  }
};

module.exports = connectDB;
