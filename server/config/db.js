const mongoose = require('mongoose');
const seedData = require('../utils/seedData');

let cachedPromise = null;

const connectDB = async () => {
  if (mongoose.connection.readyState === 1) {
    return mongoose.connection;
  }

  if (cachedPromise) {
    return cachedPromise;
  }

  const DEFAULT_URI = 'mongodb+srv://razaaqib7860_db_user:jDrheaakP1wzKBf6@capacity.ssjb2pb.mongodb.net/?appName=capacity';
  const connUri = process.env.MONGODB_URI || DEFAULT_URI;

  mongoose.set('bufferCommands', false);

  console.log('Connecting to MongoDB Atlas...');
  cachedPromise = mongoose.connect(connUri, {
    serverSelectionTimeoutMS: 10000,
    connectTimeoutMS: 10000,
    family: 4
  }).then(conn => {
    console.log(`MongoDB Connected successfully: ${conn.connection.host}`);
    seedData().catch(err => console.warn('Seed data warning:', err.message));
    return conn.connection;
  }).catch(err => {
    cachedPromise = null;
    console.error('MongoDB Atlas connection error:', err.message);
    throw err;
  });

  return cachedPromise;
};

module.exports = connectDB;
