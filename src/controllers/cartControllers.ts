import { NextFunction, Request, Response } from 'express';

import expressAsyncHandler from 'express-async-handler';

import prisma from '../lib/prisma';
import {
  TCartItemBaseSchema,
  TCartItemQuantitySchema,
} from '../schemas/cartSchema';

//@desc fetch a user cart
//@route GET api/cart/
//@access private
export const getCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const userCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        cartItems: {
          include: {
            product: true,
          },
        },
      },
    });

    if (!userCart || userCart.cartItems.length === 0) {
      res.status(404);
      throw new Error(`There's currently no item in cart.`);
    }

    res.status(200).json({
      success: true,
      message: 'Successfull.',
      data: { userCart },
    });
  }
);

//@desc add item to cart
//@route POST api/cart/
//@access private
export const addToCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;
    const { productId } = req.body as TCartItemBaseSchema;

    //a) find the product
    const product = await prisma.product.findUnique({
      where: {
        id: productId,
      },
    });

    // if there's no product or the quantity is 0 then the product is out of stock
    if (!product || product.quantity === 0) {
      res.status(404);
      throw new Error(`Product does not exist or is currently out of stock.`);
    }

    //b) check if the user has a cart already? if so, fetch the cartItems
    const userCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
      include: {
        cartItems: true,
      },
    });

    // if the user has a cart update the cartItem, else create the cart and add the cartItem
    if (userCart) {
      // check if the product is in cart
      const productExitsInUserCart = userCart.cartItems.find(
        (item) => item.productId === productId
      );

      if (productExitsInUserCart) {
        if (productExitsInUserCart.quantity + 1 > product.quantity) {
          res.status(400);
          throw new Error('Cannot add more than available stock.');
        }
        await prisma.cartItem.update({
          where: { id: productExitsInUserCart.id },
          data: {
            quantity: productExitsInUserCart.quantity + 1,
          },
        });
      } else {
        await prisma.cartItem.create({
          data: {
            cart: { connect: { id: userCart.id } },
            product: { connect: { id: productId } },
            quantity: 1,
            price: product.price,
          },
        });
      }
    } else {
      await prisma.cart.create({
        data: {
          cartItems: {
            create: {
              price: product.price,
              quantity: 1,
              product: {
                connect: {
                  id: productId,
                },
              },
            },
          },
          user: {
            connect: {
              id: userId,
            },
          },
        },
      });
    }

    const updatedCart = await prisma.cart.findUnique({
      where: { userId },
      include: { cartItems: { include: { product: true } } },
    });

    res.status(200).json({
      success: true,
      message: 'Successful.',
      data: { cart: updatedCart },
    });
  }
);

//@desc Update cart item quantity
//@route PATCH api/cart/cartItem/:id
//@access private

export const changeProductQuantity = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;
    const { quantity } = req.body as TCartItemQuantitySchema;

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id,
      },
      include: {
        product: true,
        cart: true,
      },
    });

    if (!cartItem) {
      res.status(404);
      throw new Error(`CartItem with ID: ${id} does not exist`);
    }

    if (cartItem.cart.userId !== req.user.userId) {
      res.status(403);
      throw new Error('You are not authorized to update this cart item.');
    }

    if (cartItem.product.quantity < quantity) {
      res.status(400);
      throw new Error('Cannot add more than available stock.');
    }

    await prisma.cartItem.update({
      where: {
        id,
      },
      data: {
        quantity,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfull.',
    });
  }
);

//@desc add item to cart
//@route DELETE api/cart/cartItem/:id
//@access private
export const removeProductFromCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { id } = req.params as RequestParams;

    const cartItem = await prisma.cartItem.findUnique({
      where: {
        id,
      },
      include: {
        cart: true,
      },
    });

    if (!cartItem) {
      res.status(404);
      throw new Error(`CartItem with ID: ${id} does not exist`);
    }

    if (cartItem.cart.userId !== req.user.userId) {
      res.status(403);
      throw new Error('You are not authorized to delete this cart item.');
    }

    await prisma.cartItem.delete({
      where: {
        id: cartItem.id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfull.',
    });
  }
);

//@desc add item to cart
//@route POST api/cart/
//@access private
export const clearCart = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const userCart = await prisma.cart.findUnique({
      where: {
        userId,
      },
    });

    if (!userCart) {
      res.status(404);
      throw new Error(`User with ID: {${userId}} does not have a cart yet.`);
    }

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    res.status(200).json({
      success: true,
      message: 'Successfull.',
    });
  }
);
