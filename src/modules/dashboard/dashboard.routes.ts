import { Router } from 'express';
import { dashboard } from './dashboard.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, dashboard);

export { router as dashboardRoutes };
