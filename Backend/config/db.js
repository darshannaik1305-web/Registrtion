import mongoose from 'mongoose';

export const connectDB = async () => {
  try {
    const conn = await mongoose.connect(process.env.MONGODB_URI || 'mongodb://127.0.0.1:27017/registration_db');
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    console.error(`MongoDB Connection Error: ${error.message}`);
    // Do not exit process in dev if user hasn't started mongo yet, log clear message
    console.log('Ensure MongoDB service is running locally or provide MONGODB_URI in Backend/.env');
  }
};
