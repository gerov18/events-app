import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import {
  adminDeleteUserHandler,
  adminDeleteOrganiserHandler,
} from '../controllers/adminController';

const router = Router();

router.delete(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']),
  adminDeleteUserHandler
);

router.delete(
  '/organisers/:id',
  authenticate,
  authorize(['ADMIN']),
  adminDeleteOrganiserHandler
);

export default router;
