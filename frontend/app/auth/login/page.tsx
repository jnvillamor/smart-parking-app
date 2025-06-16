import LoginForm from '@/components/forms/LoginForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Car } from 'lucide-react';
import Link from 'next/link';

const LoginPage = async () => {
  return (
    <div className='min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4'>
      <Card className='w-full max-w-md'>
        <CardHeader className='text-center'>
          <div className='flex items-center justify-center space-x-2 mb-4'>
            <Car className='h-8 w-8 text-blue-600' />
            <span className='text-2xl font-bold'>SmartPark</span>
          </div>
          <CardTitle>Welcome Back</CardTitle>
          <CardDescription>Sign in to your account to continue</CardDescription>
        </CardHeader>
        <CardContent>
          <LoginForm />
          <div className='mt-6 text-center space-y-2'>
            <div className='text-sm text-gray-600'>
              Don&apos;t have an account?{' '}
              <Link href='/auth/register' className='text-blue-600 hover:underline'>
                Sign up
              </Link>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default LoginPage;
