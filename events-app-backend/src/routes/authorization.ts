import { Router } from 'express';

import {
  requestOrganiserRole,
  viewRoleRequests,
  updateRoleRequest,
} from '../controllers/authorizationController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.post('/request-organiser', [authenticate], requestOrganiserRole);
router.get(
  '/role-requests',
  [authenticate, authorize(['ADMIN'])],
  viewRoleRequests
);
router.post(
  '/role-requests/:id',
  [authenticate, authorize(['ADMIN'])],
  updateRoleRequest
);

export default router;
