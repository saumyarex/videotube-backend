import mongoose from 'mongoose';
import 'dotenv/config';
import { DB_NAME } from '../constants.js';

const connectDB = async () => {
  try {
    const connectionInstance = await mongoose.connect(
      `${process.env.MONGO_URI}/${DB_NAME}`
    );

    if (connectionInstance) {
      console.log(
        `MongoDB connected || DB Host : ${connectionInstance.connection.host} `
      );
    }
  } catch (error) {
    console.log('MONGO_DB CONNECTION FAILED', error);
    process.exit(1);
  }
};

export default connectDB;
