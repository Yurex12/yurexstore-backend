import { z } from 'zod';

export const wishListSchema = z.object({
  productId: z.string().min(1, 'ProductId is required'),
});

export type TWishListSchema = z.infer<typeof wishListSchema>;
