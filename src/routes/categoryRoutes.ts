import express from 'express';
import { validateToken } from '../middlewares/validateTokenHandler';
import { validateData } from '../middlewares/validation';
import { categorySchema } from '../schemas/categorySchema';
import {
  createCategory,
  deleteCategory,
  getCategories,
  getCategory,
  updateCategory,
} from '../controllers/categoryControllers';

const router = express.Router();

router
  .get('/', getCategories)
  .post('/', validateToken, validateData(categorySchema), createCategory);

router
  .get('/:id', getCategory)
  .put('/:id', validateToken, validateData(categorySchema), updateCategory)
  .delete('/:id', validateToken, deleteCategory);

export default router;
