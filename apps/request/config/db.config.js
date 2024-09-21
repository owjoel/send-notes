const mongoose = require('mongoose');
const RequestItem = require('../models/RequestItem');
require('dotenv').config();

const connectDB = async () => {
    try {
        const conn = await mongoose.connect(process.env.MONGODB_URI);
        console.log(`MongoDB Connected: ${conn.connection.host}`);
    } catch (err) {
        console.error(err.message);
        process.exit(1);
    }
};

connectDB()
async function dropCollection() {
    try {

        await RequestItem.dropCollection();

        console.log('Collection dropped successfully');
    } catch (error) {
        console.error('Error dropping collection:', error);
    } finally {
        // Close the Mongoose connection
        await connectDB.disconnect();
    }
}

dropCollection();

