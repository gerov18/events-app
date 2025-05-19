import { Router } from 'express';
import {
  register,
  login,
  logoutHandler,
} from '../controllers/authenticationController';
import { authenticate } from '../middlewares/authenticate';
import { loginSchema, registerSchema } from '../schemas/authenticationSchema';
import { validate } from '../middlewares/validate';
import { getUserById } from '../services/userService';

const router = Router();
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', authenticate, logoutHandler);

export default router;
