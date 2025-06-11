import z from 'zod';

export const LoginSchema = z.object({
  username: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' }),
  password: z.string().min(6, { message: 'Password must be at least 6 characters long' }).nonempty({ message: 'Password is required' })
});

export const RegistrationSchema = z
  .object({
    firstName: z
      .string()
      .min(2, { message: 'First name must be at least 2 characters long' })
      .max(50, { message: 'First name cannot exceed 50 characters' })
      .nonempty({ message: 'First name is required' }),

    lastName: z
      .string()
      .min(2, { message: 'Last name must be at least 2 characters long' })
      .max(50, { message: 'Last name cannot exceed 50 characters' })
      .nonempty({ message: 'Last name is required' }),

    email: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' }),

    password: z
      .string()
      .min(6, { message: 'Password must be at least 6 characters long' })
      .max(100, { message: 'Password cannot exceed 100 characters' })
      .nonempty({ message: 'Password is required' }),

    confirmPassword: z
      .string()
      .min(6, { message: 'Confirm password must be at least 6 characters long' })
      .max(100, { message: 'Confirm password cannot exceed 100 characters' })
      .nonempty({ message: 'Confirm password is required' })
  })
  .refine((data) => data.password === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword']
  });