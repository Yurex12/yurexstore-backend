import { NextFunction, Request, Response } from 'express';

import expressAsyncHandler from 'express-async-handler';

import prisma from '../lib/prisma';
import { TAddressSchema } from '../schemas/addressShema';

//@desc fetch a user address
//@route GET api/address/
//@access private
export const getAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const addresses = await prisma.address.findMany({
      where: {
        userId,
      },
      orderBy: {
        isDefault: 'desc',
      },
    });

    res.status(200).json({
      success: true,
      message: 'Addresses fetched successfully.',
      data: { addresses },
    });
  }
);

//@desc create a user address
//@route POST api/address/
//@access private
export const createAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const { street, city, state, phone, isDefault } =
      req.body as TAddressSchema;

    const userId = req.user.userId;

    const userAddress = await prisma.address.findMany({
      where: {
        userId,
      },
    });

    let newAddress;

    if (!userAddress.length) {
      newAddress = await prisma.address.create({
        data: {
          street,
          city,
          state,
          phone,
          user: { connect: { id: userId } },
          isDefault: true,
        },
      });

      res.status(201).json({
        success: true,
        message: 'Successfull.',
        data: { newAddress },
      });
      return;
    }

    if (isDefault) {
      const defaultAddress = userAddress.find(
        (address) => address.isDefault === true
      );
      if (!defaultAddress) {
        res.status(404);
        throw new Error(`Please contact support`);
      }

      await prisma.address.update({
        where: {
          id: defaultAddress.id,
        },
        data: {
          isDefault: false,
        },
      });
      newAddress = await prisma.address.create({
        data: {
          street,
          city,
          state,
          phone,
          user: { connect: { id: userId } },
          isDefault: true,
        },
      });
    } else {
      newAddress = await prisma.address.create({
        data: {
          street,
          city,
          state,
          phone,
          user: { connect: { id: userId } },
          isDefault: false,
        },
      });
    }

    res.status(201).json({
      success: true,
      message: 'Successfull.',
      data: { newAddress },
    });
  }
);

//@desc upadte a user address
//@route PUT api/address/:id
//@access private
export const updateAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const addressData = req.body as TAddressSchema;
    const userId = req.user.userId;

    const { id: addressId } = req.params as RequestParams;

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      res.status(404);
      throw new Error(`This address does not exist`);
    }

    if (address.userId !== userId) {
      res.status(401);
      throw new Error(`You are not authorized to perform this action`);
    }

    const userAddress = await prisma.address.findMany({
      where: {
        userId,
      },
    });

    let updatedAddress;

    if (userAddress.length === 1) {
      updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: {
          ...addressData,
          isDefault: true,
        },
      });

      res.status(200).json({
        success: true,
        message: 'Address updated successfully.',
        data: { updateAddress },
      });
      return;
    }

    if (address.isDefault && !addressData.isDefault) {
      const newDefaultAddress = await prisma.address.findFirst({
        where: {
          id: { not: addressId },
          userId,
        },
      });
      if (!newDefaultAddress) {
        res.status(404);
        throw new Error(`This address does not exist - something went wrong.`);
      }

      await prisma.address.update({
        where: { id: newDefaultAddress.id },
        data: { isDefault: true },
      });

      updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: addressData,
      });
    } else if (!address.isDefault && addressData.isDefault) {
      const defaultAddress = userAddress.find(
        (address) => address.isDefault === true
      );

      if (!defaultAddress) {
        res.status(404);
        throw new Error(`Please contact support - something went wrong.`);
      }
      await prisma.address.update({
        where: { id: defaultAddress.id },
        data: { isDefault: false },
      });
      updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: { isDefault: true },
      });
    } else {
      updatedAddress = await prisma.address.update({
        where: { id: addressId },
        data: addressData,
      });
    }

    res.status(200).json({
      success: true,
      message: 'Address updated successfully.',
      data: { updatedAddress },
    });
  }
);

//@desc delete a user address
//@route DELETE api/address/:id
//@access private
export const deleteAddress = expressAsyncHandler(
  async (req: Request, res: Response, next: NextFunction) => {
    const userId = req.user.userId;

    const { id: addressId } = req.params as RequestParams;

    const address = await prisma.address.findUnique({
      where: {
        id: addressId,
      },
    });

    if (!address) {
      res.status(404);
      throw new Error(`This address does not exist`);
    }

    if (address.userId !== userId) {
      res.status(401);
      throw new Error(`You are not authorized to perform this action`);
    }

    const userAddress = await prisma.address.findMany({
      where: {
        userId,
      },
    });

    if (userAddress.length === 1 || !address.isDefault) {
      await prisma.address.delete({
        where: { id: addressId },
      });

      res.status(200).json({
        success: true,
        message: 'Address deleted successfully.',
      });

      return;
    }

    const newDefaultAddress = await prisma.address.findFirst({
      where: {
        id: { not: addressId },
        userId,
      },
    });

    if (!newDefaultAddress) {
      res.status(404);
      throw new Error(`This address does not exist - something went wrong.`);
    }

    await prisma.address.update({
      where: { id: newDefaultAddress.id },
      data: { isDefault: true },
    });

    await prisma.address.delete({
      where: { id: addressId },
    });

    res.status(200).json({
      success: true,
      message: 'Address deleted successfully.',
    });
  }
);
