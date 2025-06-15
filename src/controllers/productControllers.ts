import { Request, Response, NextFunction } from 'express';

import expressAsyncHandler from 'express-async-handler';

import prisma from '../lib/prisma';

//@desc Fetch products
//@route GET api/products
//@access public
export const getProducts = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const products = await prisma.product.findMany({
      include: {
        category: true,
      },
    });

    const productsLength = await prisma.product.count();
    res.status(200).json({
      success: true,
      message: 'succesful.',
      count: productsLength,
      data: {
        products,
      },
    });
  }
);

//@desc Fetch product
//@route GET api/products/:id
//@access public
export const getProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;
    const product = await prisma.product.findUnique({
      where: { id },
      include: {
        category: true,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found.');
    }

    res.status(200).json({
      success: true,
      message: 'Succesful.',
      data: {
        product,
      },
    });
  }
);

//@desc Create product
//@route POST api/products
//@access private(for admins only)

export const createProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { name, description, price, quantity, color, category } =
      req.body as ProductRequestBody;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const productCategory = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!productCategory) {
      res.status(400);
      throw new Error('Category does not exist, try creating it.');
    }

    const product = await prisma.product.create({
      data: {
        name,
        description,
        price,
        quantity,
        color,
        category: {
          connect: { id: productCategory.id },
        },
        user: {
          connect: { id: req.user.userId },
        },
      },
    });
    res.status(201).json({
      success: true,
      message: 'Product created succesfully.',
      data: { product },
    });
  }
);

//@desc update Products
//@route PATCH api/product/:id
//@access private(for admins only)

export const updateProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;

    const { name, description, price, quantity, color, category } =
      req.body as ProductRequestBody;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const product = await prisma.product.findUnique({
      where: { id },
    });

    if (!product) {
      res.status(404);
      throw new Error('Product not found.');
    }

    const productCategory = await prisma.category.findUnique({
      where: { name: category },
    });

    if (!productCategory) {
      res.status(400);
      throw new Error('Category does not exist, try creating it.');
    }

    const updatedProduct = await prisma.product.update({
      where: { id },
      data: {
        name,
        description,
        price,
        quantity,
        color,
        category: {
          connect: { id: productCategory.id },
        },
      },
      include: {
        category: true,
        user: true,
      },
    });

    res.status(200).json({
      success: true,
      message: `Product updated succesfully.`,
      data: {
        product: updatedProduct,
      },
    });
  }
);

//@desc Delete product
//@route DELETE api/product/:id
//@access private(for admins only)

export const deleteProduct = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;

    if (req.user.role !== 'ADMIN') {
      res.status(401);
      throw new Error('Unauthorized to perform this action.');
    }

    const product = await prisma.product.findUnique({ where: { id } });

    if (!product) {
      res.status(404);
      throw new Error('Product not found.');
    }

    await prisma.product.delete({ where: { id } });

    res
      .status(200)
      .json({ success: true, message: `Product deleteted succesfully.` });
  }
);
