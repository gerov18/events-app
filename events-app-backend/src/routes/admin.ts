import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import {
  adminDeleteUserHandler,
  adminDeleteOrganiserHandler,
} from '../controllers/adminController';

const router = Router();

router.post(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']),
  adminDeleteUserHandler
);

router.post(
  '/organisers/:id',
  authenticate,
  authorize(['ADMIN']),
  adminDeleteOrganiserHandler
);

export default router;
