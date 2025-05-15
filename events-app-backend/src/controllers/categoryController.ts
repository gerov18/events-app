import { Request, Response } from 'express';
import {
  createNewCategory,
  getAllCategories,
  getCategoryById,
} from '../services/categoryService';

export const getAllCategoriesHandler = async (_req: Request, res: Response) => {
  const categories = await getAllCategories();
  res.json(categories);
};

export const getCategoryByIdHandler = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;
    const category = await getCategoryById(id);
    if (!category) {
      res.status(404).json({ message: 'Category not found' });
    }
    res.json(category);
  } catch (error) {
    res.status(500).json({ message: 'Error retrieving category' });
  }
};

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    const newCategory = await createNewCategory(name);
    res.status(201).json(newCategory);
  } catch (error) {
    res.status(500).json({ message: 'Error creating category' });
  }
};
