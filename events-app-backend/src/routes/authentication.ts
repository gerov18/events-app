import { Router } from 'express';
import { register, login } from '../controllers/authenticationController';
import { authenticate } from '../middlewares/authenticate';
import { loginSchema, registerSchema } from '../schemas/authenticationSchema';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);

export default router;
