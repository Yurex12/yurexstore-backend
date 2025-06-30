import { z } from 'zod';

export const cartItemBaseSchema = z.object({
  productId: z.string().min(1, 'ProductId is required'),
  cartId: z.string().min(1, 'ProductId is required'),
});

export const cartItemQuantitySchema = z.object({
  quantity: z.number().min(1, 'Quantity must be at least 1'),
});

export type TCartItemBaseSchema = z.infer<typeof cartItemBaseSchema>;
export type TCartItemQuantitySchema = z.infer<typeof cartItemQuantitySchema>;
