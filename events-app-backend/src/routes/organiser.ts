import { Router } from 'express';
import {
  getAllOrganisersHandler,
  getOrganiserByIdHandler,
  updateOrganiserHandler,
  registerOrganiserHandler,
  loginOrganiserHandler,
  logoutHandler,
  deleteOrganiserWithCredentialsHandler,
} from '../controllers/organiserController';
import {
  createOrganiserSchema,
  deleteOrganiserSchema,
  organiserLoginSchema,
  organiserParamsSchema,
  updateOrganiserSchema,
} from '../schemas/organiserSchema';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post(
  '/register',
  validate(createOrganiserSchema),
  registerOrganiserHandler
);
router.post('/login', validate(organiserLoginSchema), loginOrganiserHandler);
router.get('/all', getAllOrganisersHandler);
router.get('/logout', logoutHandler);
router.get(
  '/organiser/:id',
  validate(organiserParamsSchema),
  getOrganiserByIdHandler
);
router.put(
  '/:id/edit',
  [validate(updateOrganiserSchema), authenticate],
  updateOrganiserHandler
);
router.delete(
  '/:id/delete',
  [validate(deleteOrganiserSchema), authenticate],
  deleteOrganiserWithCredentialsHandler
);

export default router;
