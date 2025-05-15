import { Router } from 'express';
import {
  createCategoryHandler,
  getAllCategoriesHandler,
  getCategoryByIdHandler,
} from '../controllers/categoryController';
import { authenticate } from '../middlewares/authenticate';
import { authorize } from '../middlewares/authorize';

const router = Router();

router.get('/', getAllCategoriesHandler);
router.get('/:id', getCategoryByIdHandler);
router.post('/', [authenticate, authorize(['ADMIN'])], createCategoryHandler);

export default router;
