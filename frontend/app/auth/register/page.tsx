import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import RegistrationForm from '@/components/RegistrationForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import { getServerSession } from 'next-auth';
import Link from 'next/link';
import { redirect } from 'next/navigation';
import React from 'react';

const RegisterPage = async () => {
  const session = await getServerSession(authOptions);
  if (session) {
    redirect('/dashboard');
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <Car className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold'>SmartPark</span>
          </div>
          <CardTitle className='text-2xl mt-1.5 font-bold'>Create an Account</CardTitle>
          <CardDescription className='text-muted-foreground text-sm'>Join SmartPark and start parking smarter</CardDescription>
        </CardHeader>
        <CardContent className='space-y-6'>
          {/* Register Form */}
          <RegistrationForm />
          {/* Sign in option */}
          <div className='flex items-center w-full space-x-2 justify-center'>
            <p className='text-sm text-gray-600'>Already have an account?</p>
            <Link href='/auth/login' className='text-blue-600 hover:underline text-sm'>
              Sign in
            </Link>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default RegisterPage;
