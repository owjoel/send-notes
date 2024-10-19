const mongoose = require('mongoose');
require('dotenv').config();

let isConnected = false; // Track connection state

const connectDB = async () => {
  if (isConnected) return; // Avoid multiple connections

  try {
    const dbUri =
      process.env.NODE_ENV === 'test'
        ? process.env.TEST_MONGODB_URI // Use test DB for integration tests
        : process.env.MONGODB_URI; // Use Atlas for production or development

    const conn = await mongoose.connect(dbUri);

    isConnected = mongoose.connection.readyState === 1

  } catch (err) {
    console.error(`Database connection error: ${err.message}`);
    process.exit(1);
  }
};

module.exports = connectDB;
