import { Router } from 'express';
import {
  getAllOrganisersHandler,
  getOrganiserByIdHandler,
  updateOrganiserHandler,
  deleteOrganiserHandler,
  registerOrganiserHandler,
  loginOrganiserHandler,
} from '../controllers/organiserController';
import {
  createOrganiserSchema,
  organiserLoginSchema,
  organiserParamsSchema,
  updateOrganiserSchema,
} from '../schemas/organiserSchema';
import { validate } from '../middlewares/validate';
import { authenticate } from '../middlewares/authenticate';

const router = Router();

router.post(
  '/organiserRegister',
  validate(createOrganiserSchema),
  registerOrganiserHandler
);
router.post(
  '/organiserLogin',
  validate(organiserLoginSchema),
  loginOrganiserHandler
);
router.get('/organisers', getAllOrganisersHandler);
router.get(
  '/organiser/:id',
  validate(organiserParamsSchema),
  getOrganiserByIdHandler
);
router.put(
  'organiser/:id/editOrganiser',
  [validate(updateOrganiserSchema), authenticate],
  updateOrganiserHandler
);
router.delete(
  '/organiser/:id/delete',
  validate(organiserParamsSchema),
  deleteOrganiserHandler
);

export default router;
