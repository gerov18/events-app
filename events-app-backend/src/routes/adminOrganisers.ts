import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import {
  organiserParamsSchema,
  updateOrganiserSchema,
} from '../schemas/organiserSchema';
import { authorize } from '../middlewares/authorize';
import {
  getAllOrganisersAdmin,
  getOrganiserByIdAdmin,
  updateOrganiserAdmin,
  deleteOrganiserAdmin,
} from '../controllers/adminOrganisersController';

const router = Router();

router.get(
  '/organisers',
  authenticate,
  authorize(['ADMIN']),
  getAllOrganisersAdmin
);

router.get(
  '/organisers/:id',
  authenticate,
  authorize(['ADMIN']),
  validate(organiserParamsSchema),
  getOrganiserByIdAdmin
);

router.patch(
  '/organisers/:id',
  authenticate,
  authorize(['ADMIN']),
  [validate(organiserParamsSchema), validate(updateOrganiserSchema)],
  updateOrganiserAdmin
);

router.delete(
  '/organisers/:id',
  authenticate,
  authorize(['ADMIN']),
  validate(organiserParamsSchema),
  deleteOrganiserAdmin
);

export default router;
