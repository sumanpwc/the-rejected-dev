// src/config/db.ts
/*
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
*/

// src/config/db.ts
import mongoose from 'mongoose';

export const connectDB = async () => {
  const MONGO_URI = process.env.MONGODB_URI as string;

  if (!MONGO_URI) {
    throw new Error('❌ MONGODB_URI is not defined in environment variables');
  }

  try {
    await mongoose.connect(MONGO_URI, {
      dbName: 'App_Records', // Optional: Replace with actual DB name
      serverSelectionTimeoutMS: 5000, // Optional: Fail faster if MongoDB is unreachable
    });

    console.log('✅ MongoDB Atlas connected');

    // Optional: Listeners for more insights
    mongoose.connection.on('connected', () => {
      console.log('🟢 MongoDB connection established');
    });

    mongoose.connection.on('disconnected', () => {
      console.warn('🟡 MongoDB disconnected. Attempting to reconnect...');
    });

    mongoose.connection.on('error', (err) => {
      console.error('🔴 MongoDB connection error:', err);
    });

    process.on('SIGINT', async () => {
      await mongoose.connection.close();
      console.log('🔌 MongoDB disconnected on app termination');
      process.exit(0);
    });

  } catch (error) {
    console.error('❌ Initial MongoDB connection failed:', (error as Error).message);
    process.exit(1);
  }
};
