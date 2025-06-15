import express from 'express';
import {
  createProduct,
  deleteProduct,
  getProduct,
  getProducts,
  updateProduct,
} from '../controllers/productControllers';
import { validateToken } from '../middlewares/validateTokenHandler';
import { validateData } from '../middlewares/validation';
import { productSchema } from '../schemas/productSchema';

const router = express.Router();

router
  .get('/', getProducts)
  .post('/', validateToken, validateData(productSchema), createProduct);

router
  .get('/:id', getProduct)
  .put('/:id', validateToken, validateData(productSchema), updateProduct)
  .delete('/:id', validateToken, deleteProduct);

export default router;
