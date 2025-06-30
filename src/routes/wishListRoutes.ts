import express from 'express';
import { validateToken } from '../middlewares/validateTokenHandler';
import {
  clearWishList,
  createWishListItem,
  getWishList,
  removewishListItem,
} from '../controllers/wishListControllers';
import { validateData } from '../middlewares/validation';
import { wishListSchema } from '../schemas/wishListSchema';

const router = express.Router();

router
  .get('/', validateToken, getWishList)
  .post('/', validateToken, validateData(wishListSchema), createWishListItem)
  .delete('/', validateToken, clearWishList);

router.delete('/wishlist/:id', validateToken, removewishListItem);

export default router;
