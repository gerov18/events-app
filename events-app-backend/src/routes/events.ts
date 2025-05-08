import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  getAllEventsHandler,
  getEventByIdHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/eventsController';
import { authorize } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createEventSchema,
  eventParamsSchema,
  updateEventSchema,
} from '../schemas/eventSchema';

const router = Router();

router.get('/', getAllEventsHandler);
router.get('/:id', validate(eventParamsSchema), getEventByIdHandler);
router.post(
  '/',
  [authenticate, authorize(['ORGANISER']), validate(createEventSchema)],
  createEventHandler
);
router.put(
  '/:id',
  [authenticate, authorize(['ORGANISER']), validate(updateEventSchema)],
  updateEventHandler
);
router.delete(
  '/:id',
  [authenticate, authorize(['ORGANISER']), validate(eventParamsSchema)],
  deleteEventHandler
);

export default router;
