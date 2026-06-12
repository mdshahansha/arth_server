import { Router } from 'express';
import { updateProfileHandler, changePasswordHandler } from './settings.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.put('/profile', authenticate, updateProfileHandler);
router.put('/password', authenticate, changePasswordHandler);

export { router as settingsRoutes };
