import { Router } from 'express';

import {
  viewRoleRequests,
  updateRoleRequest,
  requestAdminRole,
} from '../controllers/authorizationController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';
import { updateRoleRequestSchema } from '../schemas/authorizationSchema';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/request-organiser', [authenticate], requestAdminRole);
router.get(
  '/role-requests',
  [authenticate, authorize(['ADMIN'])],
  viewRoleRequests
);
router.post(
  '/role-requests/:id',
  [authenticate, authorize(['ADMIN']), validate(updateRoleRequestSchema)],
  updateRoleRequest
);

export default router;
