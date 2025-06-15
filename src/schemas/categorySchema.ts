import z from 'zod';

export const categorySchema = z.object({
  name: z.string().trim().min(1, 'Name must be at least 3 characters.'),
});

export type TCategorySchema = z.infer<typeof categorySchema>;
