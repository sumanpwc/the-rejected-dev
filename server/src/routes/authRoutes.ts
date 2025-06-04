// server/routes/authRoutes.ts

import express from 'express';
import { login, register } from '../controllers/authController';

const router = express.Router();

// 👤 Public login route for dashboard users (admin/editor)
router.post('/login', login);

// 🔐 Registration route
router.post('/register', register);

export default router;
