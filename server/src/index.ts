// src/index.ts
import dotenv from 'dotenv';
import app from './app';
import { connectDB } from './config/db';

dotenv.config();

const PORT = process.env.PORT || 5000;

// Connect to DB and start server
const startServer = async () => {
  try {
    await connectDB();
    app.listen(PORT, () => {
      console.log(`✅ Server running on http://localhost:${PORT}`);
    });
  } catch (err) {
    console.error('❌ Server startup error:', (err as Error).message);
    process.exit(1);
  }
};

startServer();
