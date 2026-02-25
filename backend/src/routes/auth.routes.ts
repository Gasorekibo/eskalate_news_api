import { Router } from 'express';
import { signup, login } from '../controllers/auth.controller';
import { validateRequest } from '../middleware/validation.middleware';
import { signupSchema, loginSchema } from '../utils/validation';

const router = Router();

router.post('/register', validateRequest(signupSchema), signup);
router.post('/login', validateRequest(loginSchema), login);

export default router;
