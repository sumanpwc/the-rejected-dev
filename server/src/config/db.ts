// src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI as string;

  if (!MONGO_URI) {
    throw new Error('MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(MONGO_URI);
    console.log('✅ MongoDB Atlas connected');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', (error as Error).message);
    process.exit(1);
  }
};
