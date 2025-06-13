'use client';

import { RegistrationSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { registerUser } from '@/lib/auth';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

type RegistrationFormInputs = z.infer<typeof RegistrationSchema>;

const RegistrationForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(RegistrationSchema)
  });

  const handleRegistration = async (data: RegistrationFormInputs) => {
    const res = await registerUser(data);

    if (!res.success) {
      console.log('Registration failed:', res.message);
      toast.error(res.message || 'Registration failed. Please try again.');
    }

    toast.success(res.message || 'Registration successful! You can now log in.');
    try {
      await signIn('credentials', {
        email: data.email,
        password: data.password,
        redirect: true,
        callbackUrl: '/'
      });
    } catch (error) {
      console.log('Error during sign-in:', error);
      toast.error('Failed to sign in. Please check your credentials and try again.');
      return;
    }
  };

  return (
    <form onSubmit={handleSubmit(handleRegistration)} className='space-y-4'>
      {errors.root && <p className='text-red-500 text-sm mb-4'>{errors.root.message}</p>}
      <div className='space-y-2'>
        <Label htmlFor='firstName'>First Name</Label>
        <div>
          <Input type='text' id='firstName' placeholder='Enter your first name' {...register('firstName')} />
          {errors.firstName && <p className='text-red-500 text-sm mt-1'>{errors.firstName.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='lastName'>Last Name</Label>
        <div>
          <Input type='text' id='lastName' placeholder='Enter your last name' {...register('lastName')} />
          {errors.lastName && <p className='text-red-500 text-sm mt-1'>{errors.lastName.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='email'>Email</Label>
        <div>
          <Input type='email' id='email' placeholder='Enter your email' {...register('email')} />
          {errors.email && <p className='text-red-500 text-sm mt-1'>{errors.email.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <div className='relative'>
          <div>
            <Input {...register('password')} id='password' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' />
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={() => setShowPassword(!showPassword)}>
            {showPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </Button>
        </div>
        {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
      </div>

      <div className='space-y-2'>
        <Label htmlFor='confirmPassword'>Confirm Password</Label>
        <div className='relative'>
          <div>
            <Input
              {...register('confirmPassword')}
              id='confirmPassword'
              type={showConfirmPassword ? 'text' : 'password'}
              placeholder='Enter your password'
            />
          </div>
          <Button
            type='button'
            variant='ghost'
            size='sm'
            className='absolute right-0 top-0 h-full px-3 py-2 hover:bg-transparent'
            onClick={() => setShowConfirmPassword(!showConfirmPassword)}>
            {showConfirmPassword ? <EyeOff className='h-4 w-4' /> : <Eye className='h-4 w-4' />}
          </Button>
        </div>
        {errors.confirmPassword && <p className='text-red-500 text-sm mt-1'>{errors.confirmPassword.message}</p>}
      </div>
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Registering...' : 'Register'}
      </Button>
    </form>
  );
};

export default RegistrationForm;
