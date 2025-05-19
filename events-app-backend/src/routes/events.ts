import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  getAllEventsHandler,
  getEventByIdHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/eventsController';
import { authorize, authorizeOrganiserOnly } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createEventSchema,
  eventParamsSchema,
  updateEventSchema,
} from '../schemas/eventSchema';

const router = Router();

router.get('/', getAllEventsHandler);
router.get('/event/:id', validate(eventParamsSchema), getEventByIdHandler);
router.post(
  '/create',
  [authenticate, authorizeOrganiserOnly, validate(createEventSchema)],
  createEventHandler
);
router.put(
  '/edit/:id',
  [authenticate, authorizeOrganiserOnly, validate(updateEventSchema)],
  updateEventHandler
);
router.delete(
  '/delete/:id',
  [authenticate, authorizeOrganiserOnly, validate(eventParamsSchema)],
  deleteEventHandler
);

export default router;
