import z from 'zod';

export const productSchema = z.object({
  name: z.string().trim().min(1, 'Name is required'),
  description: z.string().trim().min(1, 'Description is required'),
  price: z.number().positive('Price must be greater than 0'),
  quantity: z.number().int().nonnegative('Quantity must be 0 or more'),
  color: z.string().trim().min(1, 'Color is required'),
  category: z.string().trim().min(1, 'Category is required'),
});
