import { Request, Response } from 'express';
import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
} from '../services/categoryService';
import {
  CreateCategoryInput,
  CategoryParamsInput,
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
  req: Request<CategoryParamsInput>,
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
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category', error });
  }
};

export const createCategoryHandler = async (
  req: Request<{}, {}, CreateCategoryInput>,
  res: Response
) => {
  try {
    const { name } = req.body;
    const newCategory = await createNewCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category', error });
  }
};
