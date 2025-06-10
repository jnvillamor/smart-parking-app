'use client';

import React from 'react';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Button } from './ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { LoginSchema } from '@/lib/schema';
import { toast } from 'sonner';
import { signIn } from 'next-auth/react';

type LoginInputs = z.infer<typeof LoginSchema>;

const LoginForm = () => {
  const [showPassword, setShowPassword] = React.useState(false);
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm({
    resolver: zodResolver(LoginSchema)
  });

  const handleSignIn = async (data: LoginInputs) => {
    try {
      await signIn('credentials', {
        email: data.username,
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
    <form onSubmit={handleSubmit(handleSignIn)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='username'>Email</Label>
        <div>
          <Input id='username' type='email' placeholder='Enter your email' {...register('username')} />
          {errors.username && <p className='text-red-500 text-sm mt-1'>{errors.username.message}</p>}
        </div>
      </div>
      <div className='space-y-2'>
        <Label htmlFor='password'>Password</Label>
        <div className='relative'>
          <div>
            <Input {...register('password')} id='password' type={showPassword ? 'text' : 'password'} placeholder='Enter your password' required />
            {errors.password && <p className='text-red-500 text-sm mt-1'>{errors.password.message}</p>}
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
      </div>
      <Button type='submit' className='w-full' disabled={isSubmitting}>
        {isSubmitting ? 'Signing in...' : 'Sign In'}
      </Button>
    </form>
  );
};

export default LoginForm;
