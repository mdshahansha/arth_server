import { Router } from 'express';
import { register, login, logout } from './auth.controller';
import { validate } from '../../middlewares/validate';
import { authenticate } from '../../middlewares/authenticate';
import { authRateLimiter } from '../../middlewares/rateLimiter';
import { registerSchema, loginSchema } from './auth.schemas';

const router = Router();

router.post('/register', authRateLimiter, validate(registerSchema), register);
router.post('/login', authRateLimiter, validate(loginSchema), login);
router.post('/logout', authenticate, logout);

export { router as authRoutes };
