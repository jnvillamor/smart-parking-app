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

export const UpdateProfileSchema = z.object({
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

  email: z.string().email({ message: 'Invalid email address' }).nonempty({ message: 'Email is required' })
});

export const UpdatePasswordSchema = z
  .object({
    currentPassword: z
      .string()
      .min(6, { message: 'Current password must be at least 6 characters long' })
      .nonempty({ message: 'Current password is required' }),

    newPassword: z
      .string()
      .min(6, { message: 'New password must be at least 6 characters long' })
      .max(100, { message: 'New password cannot exceed 100 characters' })
      .nonempty({ message: 'New password is required' }),

    confirmNewPassword: z
      .string()
      .min(6, { message: 'Confirm new password must be at least 6 characters long' })
      .max(100, { message: 'Confirm new password cannot exceed 100 characters' })
      .nonempty({ message: 'Confirm new password is required' })
  })
  .refine((data) => data.newPassword === data.confirmNewPassword, {
    message: 'New passwords do not match'
  });

export const AddLocationSchema = z.object({
  name: z
    .string()
    .min(2, { message: 'Location name must be at least 2 characters long' })
    .max(100, { message: 'Location name cannot exceed 100 characters' })
    .nonempty({ message: 'Location name is required' }),

  location: z
    .string()
    .min(2, { message: 'Location must be at least 2 characters long' })
    .max(200, { message: 'Location cannot exceed 200 characters' })
    .nonempty({ message: 'Location is required' }),

  total_slots: z
    .number()
    .min(2, { message: 'Total slots must be at least 2' })
    .max(1000, { message: 'Total slots cannot exceed 1000' })
    .int({ message: 'Total slots must be an integer' })
    .nonnegative({ message: 'Total slots cannot be negative' }),

  rate: z
    .number()
    .min(2, { message: 'Rate must be at least 2' })
    .max(1000, { message: 'Rate cannot exceed 1000' })
    .nonnegative({ message: 'Rate cannot be negative' })
});

export const AddReservationSchema = z
  .object({
    parking_id: z.number().int({ message: 'Parking ID must be an integer' }).nonnegative({ message: 'Parking ID cannot be negative' }),
    user_id: z.number().int({ message: 'User ID must be an integer' }).nonnegative({ message: 'User ID cannot be negative' }),
    start_time: z.coerce.date({ message: 'Start time is required' }).refine((date) => date > new Date(), {
      message: 'Start time must be in the future'
    }),
    end_time: z.coerce.date({ message: 'End time is required' }).refine((date) => date > new Date(), {
      message: 'End time must be in the future'
    })
  })
  .refine((data) => data.start_time < data.end_time, {
    message: 'End time must be after start time',
    path: ['end_time']
  });
