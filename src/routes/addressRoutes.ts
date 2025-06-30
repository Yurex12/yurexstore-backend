import express from 'express';
import { validateToken } from '../middlewares/validateTokenHandler';
import { validateData } from '../middlewares/validation';
import { addressSchema } from '../schemas/addressShema';
import {
  createAddress,
  deleteAddress,
  getAddress,
  updateAddress,
} from '../controllers/addressControllers';

const router = express.Router();

router
  .get('/', validateToken, getAddress)
  .post('/', validateToken, validateData(addressSchema), createAddress);

router
  .patch('/:id', validateToken, validateData(addressSchema), updateAddress)
  .delete('/:id', validateToken, deleteAddress);

export default router;
