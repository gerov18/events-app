import { RequestHandler, Router } from 'express';
import { authenticate } from '../middlewares/authenticate';
import {
  getAllEventsHandler,
  getEventByIdHandler,
  createEventHandler,
  updateEventHandler,
  deleteEventHandler,
  uploadEventImageHandler,
  getEventImagesHandler,
} from '../controllers/eventsController';
import { authorize, authorizeOrganiserOnly } from '../middlewares/authorize';
import { validate } from '../middlewares/validate';
import {
  createEventSchema,
  eventParamsSchema,
  updateEventSchema,
} from '../schemas/eventSchema';
import { uploadToCloudinary } from '../utils/cloudinary';

const router = Router();
const multerMiddleware = uploadToCloudinary.array(
  'images',
  5
) as unknown as RequestHandler;

router.get('/', getAllEventsHandler);
router.get('/:id', validate(eventParamsSchema), getEventByIdHandler);
router.post(
  '/create',
  [authenticate, authorizeOrganiserOnly, validate(createEventSchema)],
  createEventHandler
);
router.patch(
  '/:id',
  [authenticate, authorizeOrganiserOnly, validate(updateEventSchema)],
  updateEventHandler
);
router.post(
  '/:id/delete',
  [authenticate, authorizeOrganiserOnly, validate(eventParamsSchema)],
  deleteEventHandler
);

router.post(
  '/:id/images',
  authenticate,
  multerMiddleware,
  uploadEventImageHandler
);

router.get('/:id/images', getEventImagesHandler);

export default router;
