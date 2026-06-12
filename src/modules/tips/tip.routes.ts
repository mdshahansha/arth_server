import { Router } from 'express';
import { tips, toggleSave } from './tip.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', tips);
router.post('/:tipId/save', authenticate, toggleSave);

export { router as tipRoutes };
