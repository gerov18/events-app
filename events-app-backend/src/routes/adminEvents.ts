import { Router, Request, Response } from 'express';
import { authenticate } from '../middlewares/authenticate';
import { validate } from '../middlewares/validate';
import { eventParamsSchema, updateEventSchema } from '../schemas/eventSchema';

import { authorize } from '../middlewares/authorize';
import {
  getEventByIdForAdmin,
  updateEventByAdmin,
  deleteEventByAdmin,
} from '../controllers/adminEventsController';

const router = Router();

router.get(
  '/events/:id',
  authenticate,
  authorize(['ADMIN']),
  validate(eventParamsSchema),
  getEventByIdForAdmin
);

router.patch(
  '/events/:id',
  authenticate,
  authorize(['ADMIN']),
  [validate(eventParamsSchema), validate(updateEventSchema)],
  updateEventByAdmin
);

router.delete(
  '/events/:id',
  authenticate,
  authorize(['ADMIN']),
  validate(eventParamsSchema),
  deleteEventByAdmin
);

export default router;
