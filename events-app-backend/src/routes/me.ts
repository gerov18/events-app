import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { meHandler } from '../controllers/meController';

const router = Router();

router.get('/me', authenticate, meHandler);

export default router;
