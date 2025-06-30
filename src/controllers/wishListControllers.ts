import { NextFunction, Request, Response } from 'express';

import expressAsyncHandler from 'express-async-handler';

import prisma from '../lib/prisma';
import { TWishListSchema } from '../schemas/wishListSchema';

//@desc fetch a user wishlist
//@route GET api/wishlist/
//@access private
export const getWishList = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const wishList = await prisma.wishList.findUnique({
      where: {
        userId,
      },
      include: {
        wishListItems: true,
      },
    });

    if (!wishList) {
      res.status(500);
      throw new Error(`There's currently no wishLists`);
    }

    res.status(200).json({
      success: true,
      message: 'Successfull.',
      data: { wishList },
    });
  }
);

//@desc Add a product to wishlist
//@route POST api/wishlist/
//@access private

export const createWishListItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { productId } = req.body as TWishListSchema;

    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    if (!product) {
      res.status(404);
      throw new Error(`Product does not exist.`);
    }

    const wishList = await prisma.wishList.findUnique({
      where: {
        userId,
      },
    });

    if (!wishList) {
      res.status(500);
      throw new Error('wishlist does not exist. Please contact support.');
    }

    const wishListItem = await prisma.wishListItem.findFirst({
      where: {
        productId,
        wishListId: wishList.id,
      },
    });

    if (wishListItem) {
      res.status(400);
      throw new Error('Product is already in your wishlist.');
    }

    await prisma.wishListItem.create({
      data: {
        productId,
        wishListId: wishList.id,
      },
    });

    const updatedWishList = await prisma.wishList.findUnique({
      where: { userId },
      include: { wishListItems: { include: { product: true } } },
    });

    res.status(201).json({
      success: true,
      message: 'Wishlist item added successfully.',
      data: { wishList: updatedWishList },
    });
  }
);

//@desc remove wishListItem from wishList
//@route Delete api/wishlist/wishlistItem/:id
//@access private
export const removewishListItem = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params;

    const wishListItem = await prisma.wishListItem.findUnique({
      where: {
        id,
      },
      include: {
        wishList: true,
      },
    });

    if (!wishListItem) {
      res.status(404);
      throw new Error('Wishlist not found.');
    }

    if (wishListItem.wishList.userId !== req.user.userId) {
      res.status(403);
      throw new Error('You are not authorized to delete this cart item.');
    }

    await prisma.wishListItem.delete({
      where: {
        id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfull.',
    });
  }
);

//@desc add clear wishList
//@route Delete api/wishlist/
//@access private
export const clearWishList = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const wishList = await prisma.wishList.findUnique({
      where: {
        userId,
      },
    });

    if (!wishList) {
      res.status(404);
      throw new Error(
        `User with ID: {${userId}} does not have a wishList yet.`
      );
    }

    await prisma.wishListItem.deleteMany({
      where: {
        wishListId: wishList.id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfull.',
    });
  }
);
