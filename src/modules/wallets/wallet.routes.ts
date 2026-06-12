import { Router } from 'express';
import { wallets } from './wallet.controller';
import { authenticate } from '../../middlewares/authenticate';

const router = Router();

router.get('/', authenticate, wallets);

export { router as walletRoutes };
