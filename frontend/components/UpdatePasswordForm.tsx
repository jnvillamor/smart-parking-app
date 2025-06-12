'use client';

import { UpdatePasswordSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Lock } from 'lucide-react';
import { Button } from './ui/button';
import { updateUserPassword } from '@/lib/user';
import { toast } from 'sonner';

type FormValues = z.infer<typeof UpdatePasswordSchema>;

const UpdatePasswordForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<FormValues>({
    resolver: zodResolver(UpdatePasswordSchema)
  });

  const onSubmit = async (data: FormValues) => {
    const res = await updateUserPassword(data);
    if (res.success) {
      toast.success(res.message);
    } else { 
      toast.error(res.message || 'Failed to update password. Please try again.');
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      {/* Current Password */}
      <div className='space-y-2'>
        <Label htmlFor='currentPassword'>Current Password</Label>
        <div>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input type='password' id='currentPassword' {...register('currentPassword')} className='pl-10' />
          </div>
          {errors.currentPassword && <p className='text-red-500 text-sm mt-1'>{errors.currentPassword.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='newPassword'>New Password</Label>
        <div>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input type='password' id='currentPassword' {...register('newPassword')} className='pl-10' />
          </div>
          {errors.newPassword && <p className='text-red-500 text-sm mt-1'>{errors.newPassword.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='confirmNewPassword'>Confirm Password</Label>
        <div>
          <div className='relative'>
            <Lock className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
            <Input type='password' id='confirmNewPassword' {...register('confirmNewPassword')} className='pl-10' />
          </div>
          {errors.confirmNewPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmNewPassword.message}</p>}
        </div>
      </div>

      <div className='flex justify-end'>
        <Button type='submit' disabled={isSubmitting}>{isSubmitting ? "Saving..." : "Save Changes"}</Button>
      </div>
    </form>
  );
};

export default UpdatePasswordForm;
