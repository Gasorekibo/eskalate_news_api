import { Router } from 'express';
import { createArticle, getMyArticles, updateArticle, deleteArticle, getArticles, getArticleById } from '../controllers/article.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';
import { validateRequest } from '../middleware/validation.middleware';
import { articleSchema } from '../utils/validation';

const router = Router();

const authorOnlyMiddleware = [authMiddleware, rbacMiddleware(['author'])]
router.get('/', getArticles);
router.get('/me', ...authorOnlyMiddleware, getMyArticles);
router.get('/:id', getArticleById);
router.post('/', ...authorOnlyMiddleware, validateRequest(articleSchema), createArticle);
router.put('/:id', ...authorOnlyMiddleware, validateRequest(articleSchema), updateArticle);
router.delete('/:id', ...authorOnlyMiddleware, deleteArticle);

export default router;
