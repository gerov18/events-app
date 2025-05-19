import { Router } from 'express';
import {
  createOrganiserHandler,
  getAllOrganisersHandler,
  getOrganiserByIdHandler,
  updateOrganiserHandler,
  deleteOrganiserHandler,
} from '../controllers/organiserController';
import {
  createOrganiserSchema,
  organiserParamsSchema,
  updateOrganiserSchema,
} from '../schemas/organiserSchema';
import { validate } from '../middlewares/validate';

const router = Router();

router.post('/', validate(createOrganiserSchema), createOrganiserHandler);
router.get('/', getAllOrganisersHandler);
router.get('/:id', validate(organiserParamsSchema), getOrganiserByIdHandler);
router.put('/:id', validate(updateOrganiserSchema), updateOrganiserHandler);
router.delete('/:id', validate(organiserParamsSchema), deleteOrganiserHandler);

export default router;
