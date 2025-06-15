import { Request, Response, NextFunction } from 'express';

import expressAsyncHandler from 'express-async-handler';

import prisma from '../lib/prisma';
import { TCategorySchema } from '../schemas/categorySchema';

export const getCategories = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const categories = await prisma.category.findMany();

    res.status(200).json({
      message: 'successful',
      data: {
        categories,
      },
    });
  }
);
export const getCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;
    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found');
    }

    res.status(200).json({
      message: 'successful',
      data: {
        category,
      },
    });
  }
);

export const createCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name } = req.body as TCategorySchema;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const newCategory = await prisma.category.create({
      data: {
        name,
      },
    });

    res.status(201).json({
      success: true,
      message: 'Category created succesfully.',
      data: { newCategory },
    });
  }
);

export const updateCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;
    const { name } = req.body as TCategorySchema;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const category = await prisma.category.findUnique({
      where: {
        id,
      },
    });

    if (!category) {
      res.status(404);
      throw new Error('Category not found, try creating it.');
    }

    const updatedCategory = await prisma.category.update({
      where: {
        id,
      },
      data: {
        name,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Category updated succesfully.',
      data: { updatedCategory },
    });
  }
);

export const deleteCategory = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const category = await prisma.category.findUnique({ where: { id } });

    if (!category) {
      res.status(404);
      throw new Error('Product not found.');
    }

    await prisma.category.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: `Category deleteted succesfully.` });
  }
);
