const mongoose = require('mongoose');
const { MongoMemoryServer } = require('mongodb-memory-server');

let mongoMemoryServer = null;

const connectDB = async () => {
  try {
    const connUri = process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/capacity_connect';
    console.log(`Connecting to MongoDB at: ${connUri}...`);
    
    // Connect with 10s timeout to allow Cloud Atlas initial connection handshake
    await mongoose.connect(connUri, {
      serverSelectionTimeoutMS: 10000
    });
    console.log(`MongoDB Connected successfully: ${mongoose.connection.host}`);
  } catch (err) {
    console.warn(`Local MongoDB connection failed (${err.message}). Launching in-memory MongoDB server...`);
    try {
      mongoMemoryServer = await MongoMemoryServer.create();
      const memoryUri = mongoMemoryServer.getUri();
      await mongoose.connect(memoryUri);
      console.log(`Connected to In-Memory MongoDB at: ${memoryUri}`);
    } catch (memErr) {
      console.error('Failed to start MongoMemoryServer:', memErr.message);
      process.exit(1);
    }
  }
};

module.exports = connectDB;
