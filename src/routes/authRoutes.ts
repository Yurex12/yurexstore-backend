import express from 'express';
import {
  getUserData,
  loginUser,
  logoutUser,
  registerUser,
} from '../controllers/authControllers';
import { validateData } from '../middlewares/validation';
import { signInSchema, signUpSchema } from '../schemas/authSchema';
import { validateToken } from '../middlewares/validateTokenHandler';

const router = express.Router();

router.post('/register', validateData(signUpSchema), registerUser);

router.post('/login', validateData(signInSchema), loginUser);

router.post('/logout', logoutUser);

router.post('/users/:id', validateToken, getUserData);

export default router;
