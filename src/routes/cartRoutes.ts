import express from 'express';
import {
  addToCart,
  changeProductQuantity,
  clearCart,
  getCart,
  removeProductFromCart,
} from '../controllers/cartControllers';
import { validateToken } from '../middlewares/validateTokenHandler';
import { validateData } from '../middlewares/validation';
import {
  cartItemBaseSchema,
  cartItemQuantitySchema,
} from '../schemas/cartSchema';

const router = express.Router();

router
  .get('/', validateToken, getCart)
  .post('/', validateToken, validateData(cartItemBaseSchema), addToCart)
  .delete('/', validateToken, clearCart);
router.patch(
  '/cartItem/:id',
  validateToken,
  validateData(cartItemQuantitySchema),
  changeProductQuantity
);
router.delete('/cartItem/:id', validateToken, removeProductFromCart);

export default router;
