import { Router } from 'express';
import { getAuthorDashboard } from '../controllers/analytics.controller';
import { authMiddleware } from '../middleware/auth.middleware';
import { rbacMiddleware } from '../middleware/rbac.middleware';

const router = Router();

router.use(authMiddleware);
router.use(rbacMiddleware(['author']));

router.get('/dashboard', getAuthorDashboard);

export default router;
