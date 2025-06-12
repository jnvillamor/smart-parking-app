'use client';

import { UpdateProfileSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { UserProfile } from '@/lib/types';
import { Button } from './ui/button';
import { updateUserProfile } from '@/lib/user';
import { toast } from 'sonner';
import { Session } from 'next-auth';

type FormValues = z.infer<typeof UpdateProfileSchema>;

const ProfileForm = ({ session }: { session: Session }) => {
  const user: UserProfile = session.user;

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(UpdateProfileSchema),
    defaultValues: {
      firstName: user.first_name,
      lastName: user.last_name,
      email: user.email
    }
  });

  const onSubmit = async (data: FormValues) => {
    const res = await updateUserProfile(data, session);

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message || 'Failed to update profile. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='grid grid-cols-1 md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='firstName'>First Name</Label>
          <div>
            <Input id='firstName' {...register('firstName')} />
            {errors.firstName && <p className='text-red-500 text-sm'>{errors.firstName.message}</p>}
          </div>
        </div>

        <div className='space-y-2'>
          <Label htmlFor='lastName'>Last Name</Label>
          <div>
            <Input id='lastName' {...register('lastName')} />
            {errors.lastName && <p className='text-red-500 text-sm'>{errors.lastName.message}</p>}
          </div>
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <div>
          <Input id='email' type='email' {...register('email')} />
          {errors.email && <p className='text-red-500 text-sm'>{errors.email.message}</p>}
        </div>
      </div>
      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
      </div>
    </form>
  );
};

export default ProfileForm;
