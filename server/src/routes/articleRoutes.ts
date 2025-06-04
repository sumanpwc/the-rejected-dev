// server/routes/articleRoutes.ts
/*
import express from 'express';
import {
  createArticle,
  getArticles,
  getArticleBySlug,
  updateArticle,
  deleteArticle,
} from '../controllers/articleController';

import { adminOnly } from '../middleware/auth';

const router = express.Router();

console.log('updateArticleById:', typeof updateArticle);
console.log('deleteArticleById:', typeof deleteArticle);
console.log('adminOnly:', typeof adminOnly);

// Public routes
router.get('/', getArticles);             // GET /api/articles?page=1&limit=10&tags=java,nodejs
router.get('/:slug', getArticleBySlug);  // GET /api/articles/some-article-slug

// Admin-only routes (mock protected)
router.post('/', adminOnly, createArticle);       // Create new article
router.put('/:id', adminOnly, updateArticle);     // Update article by ID
router.delete('/:id', adminOnly, deleteArticle);  // Delete article by ID

export default router;
*/

import express from 'express';
import { createArticle, getArticleBySlug, getArticles, updateArticle, deleteArticle } from '../controllers/articleController';
import { authenticate, authorizeRoles } from '../middleware/auth';

const router = express.Router();

router.post('/create', authenticate, authorizeRoles('admin'), createArticle);

router.get('/:slug', getArticleBySlug);

router.get('/', getArticles);

router.put('/update/:id', authenticate, authorizeRoles('admin'), updateArticle);

router.put('/delete/:id', authenticate, authorizeRoles('admin'), deleteArticle);

export default router;