import { Router } from 'express';
import { register, login } from '../controllers/authenticationController';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post('/register', authenticate, register);
router.post('/login', authenticate, login);

export default router;
