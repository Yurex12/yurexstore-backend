import z from 'zod';

export const signUpSchema = z.object({
  fullName: z.string().trim().min(1, 'Full name is required'),
  email: z.string().email('Invalid email address'),
  password: z
    .string()
    .trim()
    .min(6, 'Password must be at least 6 characters')
    .regex(/[A-Z]/, 'Password must include at least one uppercase letter')
    .regex(/[0-9]/, 'Password must include at least one number'),
  // method: z.enum(['google', 'credentials']),
});

export const signInSchema = z.object({
  email: z.string().trim().email('Invalid email address'),
  password: z.string().trim().min(6, 'Password must be at least 6 characters'),
});

export type TSignUpSchema = z.infer<typeof signUpSchema>;
export type TSignInSchema = z.infer<typeof signInSchema>;

// export const signInSchema = z.discriminatedUnion('method', [
//   z.object({
//     method: z.literal('credentials'),
//     email: z.string().email('Invalid email address'),
//     password: z.string().min(6, 'Password must be at least 6 characters'),
//   }),
//   z.object({
//     method: z.literal('google'),
//     token: z.string().email(),
//   }),
// ]);
