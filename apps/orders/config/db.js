const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false; // Track connection state

const connectDB = async () => {
  if (isConnected) return; // Avoid multiple connections

  try {
    const dbUri = process.env.MONGODB_URI
    console.log(`Connecting to MongoDB URI: ${dbUri}`);
      const conn = await mongoose.connect(dbUri);

    isConnected = mongoose.connection.readyState === 1

  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
