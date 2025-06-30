import { z } from 'zod';

export const addressSchema = z.object({
  street: z.string().trim().min(3, 'Street Name must be at least 3 characters'),
  phone: z.string().trim().min(3, 'Phone number must be at least 3 characters'),
  city: z.string().trim().min(3, 'City name must be at least 3 characters'),
  state: z.string().trim().min(3, 'State name must be at least 3 characters'),
  isDefault: z.boolean().default(false),
});

export type TAddressSchema = z.infer<typeof addressSchema>;
