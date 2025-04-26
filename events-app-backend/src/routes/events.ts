import { Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  getAllEventsHandler,
  getEventByIdHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
} from '../controllers/eventsController';

const router = Router();

router.get('/', getAllEventsHandler);
router.get('/:id', getEventByIdHandler);
router.post('/', authenticate, createEventHandler);
router.put('/:id', authenticate, updateEventHandler);
router.delete('/:id', authenticate, deleteEventHandler);

export default router;
