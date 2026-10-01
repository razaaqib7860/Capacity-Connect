const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');
const seedData = require('../utils/seedData');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const DEFAULT_URI = 'mongodb+srv://razaaqib7860_db_user:jDrheaakP1wzKBf6@capacity.ssjb2pb.mongodb.net/?appName=capacity';
    const connUri = process.env.MONGODB_URI || DEFAULT_URI;
    console.log(`Connecting to MongoDB...`);
    
    // Connect with 10s timeout to allow Cloud Atlas initial connection handshake
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
    await seedData().catch(err => console.warn('Seed data warning:', err.message));
  } catch (err) {
    console.warn(`Local MongoDB connection failed (${err.message}). Launching in-memory MongoDB server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to In-Memory MongoDB at: ${memoryUri}`);
      await seedData().catch(err => console.warn('Seed data warning:', err.message));
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
