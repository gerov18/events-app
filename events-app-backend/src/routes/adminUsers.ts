import { Router } from 'express';

import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import {
  getUserByIdAdminHandler,
  deleteUserAdminHandler,
  updateUserAdminHandler,
} from '../controllers/adminUsersController';

const router = Router();

router.get(
  '/users/:id',
  authenticate,
  authorize(['ADMIN']),
  getUserByIdAdminHandler
);

router.post(
  '/users/:id/delete',
  authenticate,
  authorize(['ADMIN']),
  deleteUserAdminHandler
);

router.patch(
  '/users/:id/edit',
  authenticate,
  authorize(['ADMIN']),
  updateUserAdminHandler
);

export default router;
