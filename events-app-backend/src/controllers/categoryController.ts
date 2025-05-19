import { Request, Response } from 'express';
import {
  getAllCategories,
  getCategoryById,
  createCategory,
  updateCategory,
  deleteCategory,
} from '../services/categoryService';
import {
  CreateCategoryInput,
  CategoryParamsInput,
  UpdateCategorySchema,
} from '../schemas/categorySchema';

export const getAllCategoriesHandler = async (_req: Request, res: Response) => {
  try {
    const categories = await getAllCategories();
    res.json(categories);
  } catch (error) {
    res.status(500).json({ message: 'Error fetching categories', error });
  }
};

export const getCategoryByIdHandler = async (
  req: Request<{ id: string }>,
  res: Response
) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(parseInt(id));
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
      return;
    }
    res.json(category);
    return;
  } catch (error) {
    res.status(500).json({ message: 'Error fetching category', error });
  }
};

export const createCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput['body']>,
  res: Response
) => {
  try {
    const { name } = req.body;
    const newCategory = await createCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};

export const updateCategoryHandler = async (
  req: Request<
    UpdateCategorySchema['params'],
    {},
    UpdateCategorySchema['body']
  >,
  res: Response
) => {
  try {
    const { id } = req.params;
    const { name } = req.body;
    const updated = await updateCategory(parseInt(id), name);
    res.json(updated);
  } catch (error) {
    res.status(500).json({ message: 'Error updating category', error });
  }
};

export const deleteCategoryHandler = async (
  req: Request<CategoryParamsInput>,
  res: Response
) => {
  try {
    const { id } = req.params;
    await deleteCategory(parseInt(id));
    res.json({ message: 'Category deleted successfully' });
  } catch (error) {
    res.status(500).json({ message: 'Error deleting category', error });
  }
};
