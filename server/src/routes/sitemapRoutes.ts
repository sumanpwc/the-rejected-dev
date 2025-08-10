// routes/sitemapRoutes.ts

import express from 'express';
import { updateSitemap } from '../controllers/sitemapController';

const router = express.Router();

router.get('/generate', updateSitemap); // GET /api/v1/sitemap/generate

export default router;
