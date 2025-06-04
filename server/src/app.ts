// src/app.ts
/*
import express from 'express';
import articleRoutes from './routes/articleRoutes';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';
import authRoutes from './routes/authRoutes';

const app = express();

// Global Middleware
app.use(express.json());

// Mount versioned API routes
app.use('/api/v1/articles', articleRoutes);

// Global Error Handler
app.use(errorHandler);

app.use(helmet());
app.use(cors());
app.use(morgan('dev'));

app.use('/api/auth', authRoutes);

export default app;
*/

// src/app.ts

import express from 'express';
import articleRoutes from './routes/articleRoutes';
import authRoutes from './routes/authRoutes';
import { errorHandler } from './middleware/errorHandler';
import helmet from 'helmet';
import cors from 'cors';
import morgan from 'morgan';

const app = express();

// Security & Logging Middleware (these should come first)
app.use(helmet());
app.use(cors({
  origin: 'http://localhost:3000',
  credentials: true, // if you're using cookies or auth headers
}));
app.use(morgan('dev'));

// Parse incoming JSON requests
app.use(express.json());

// Mount versioned API routes
app.use('/api/v1/articles', articleRoutes);
app.use('/api/auth', authRoutes);

// Global Error Handler (keep this last)
app.use(errorHandler);

export default app;
