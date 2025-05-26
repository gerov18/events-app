import { Router } from 'express';
import {
  createCategoryHandler,
  deleteCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
  updateCategoryHandler,
} from '../controllers/categoryController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get('/', getAllCategoriesHandler);

router.get('/:id', getCategoryByIdHandler);

router.post('/', [authenticate, authorize(['ADMIN'])], createCategoryHandler);

router.patch(
  '/:id',
  [authenticate, authorize(['ADMIN'])],
  updateCategoryHandler
);

router.post(
  '/:id',
  [authenticate, authorize(['ADMIN'])],
  deleteCategoryHandler
);

export default router;
