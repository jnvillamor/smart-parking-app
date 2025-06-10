import z from 'zod';

export const LoginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty({ message: 'Password is required' })
});
