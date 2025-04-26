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

const router = Router();

router.get('/', getAllEventsHandler);
router.get('/:id', getEventByIdHandler);
router.post('/', [authenticate, authorize(['ORGANISER'])], createEventHandler);
router.put(
  '/:id',
  [authenticate, authorize(['ORGANISER'])],
  updateEventHandler
);
router.delete(
  '/:id',
  [authenticate, authorize(['ORGANISER'])],
  deleteEventHandler
);

export default router;
