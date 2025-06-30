import { z } from 'zod';

export const reviewSchema = z.object({
  rating: z
    .number()
    .min(1, 'Number must be greater than 0')
    .max(5, 'Number must not be more than 5'),
  comment: z.string().trim().min(1, 'Comment must be at least 10 characters'),
  productId: z.string().min(1, 'ProductId is required'),
});

export type TReviewSchema = z.infer<typeof reviewSchema>;
