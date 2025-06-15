import { Request, Response, NextFunction } from 'express';
import expressAsyncHandler from 'express-async-handler';
import prisma from '../lib/prisma';

import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';
import { TSignInSchema, TSignUpSchema } from '../schemas/authSchema';

//@desc Register a user
//@route GET api/auth/register
//@access public
export const registerUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { fullName, password, email } = req.body as TSignUpSchema;

    const userExists = await prisma.user.findUnique({ where: { email } });

    if (userExists) {
      res.status(409);
      throw new Error('Email already exists.');
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const newUser = await prisma.user.create({
      data: { email, fullName, password: hashedPassword },
    });

    res.status(201).json({
      success: true,
      message: 'Registration succesful.',
      data: {
        userId: newUser.id,
        fullName: newUser.fullName,
        email: newUser.email,
      },
    });
  }
);

//@desc Login a user
//@route GET api/auth/login
//@access public
export const loginUser = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const { email, password } = req.body as TSignInSchema;

  const user = await prisma.user.findFirst({ where: { email } });

  if (!user) {
    res.status(404);
    throw new Error('User does not exist.');
  }

  const passwordMatch = await bcrypt.compare(password, user.password);

  if (!passwordMatch) {
    res.status(401);
    throw new Error('Email or password is wrong.');
  }

  const accessToken = jwt.sign(
    { user: { userId: user.id, role: user.role } },
    process.env.JWT_TOKEN_SECRET as string,
    { expiresIn: '7d' }
  );

  res.cookie('accessToken', accessToken, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.status(200).json({
    success: true,
    message: 'Login succesful.',
    data: {
      userId: user.id,
      fullName: user.fullName,
      email: user.email,
    },
  });
};

//@desc Logout the user and destroy the cookie
//@route GET api/auth/logout
//@access public

export const logoutUser = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    res.clearCookie('accessToken');
    res.status(200).json({ success: true, message: 'Logged out' });
  }
);

//@desc Update a user data
//@route POST api/auth/users/:id
//@access private

export const getUserData = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;

    const user = await prisma.user.findFirst({ where: { id } });

    if (!user) {
      res.status(404);
      throw new Error('User Does not exist.');
    }

    if (req.user.role !== 'ADMIN' && user.id !== req.user.userId) {
      res.status(401);
      throw new Error('Unauthorized.');
    }

    res.status(200).json({
      success: true,
      message: 'Successfull',
      data: {
        userId: user.id,
        email: user.email,
        fullName: user.fullName,
      },
    });
  }
);
