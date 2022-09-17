const mongoose = require('mongoose');

const connectDB = async () => {
    try {
        await mongoose.connect(process.env.MONGO_URI, 
          console.log('Successfully connected to MongoDB instance'));
    } catch (error) {
        // throw new Error(error);
        console.log(error);
    }
}

module.exports = connectDB;