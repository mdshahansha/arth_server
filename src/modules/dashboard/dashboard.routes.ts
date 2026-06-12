import { Router } from 'express';
import { dashboard, dashboardEvents } from './dashboard.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, dashboard);
router.get('/events', authenticate, dashboardEvents);

export { router as dashboardRoutes };
