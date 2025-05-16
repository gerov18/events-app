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
router.get('/me', authenticate, async (req, res) => {
  const userId = res.locals.user.id;
  const user = await getUserById(userId);
  try {
    if (!user) {
      res.status(404).json({ message: 'User not found' });
    }

    res.json(user);
  } catch (e) {
    console.log(e);
  }
});
router.post('/register', validate(registerSchema), register);
router.post('/login', validate(loginSchema), login);
router.post('/logout', logoutHandler);

export default router;
