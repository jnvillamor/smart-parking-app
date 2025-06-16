import { Button } from '@/components/ui/button';
import { Car } from 'lucide-react';
import Link from 'next/link';

export default async function Home() {
  return (
    <div className='min-h-screen bg-background'>
      {/* Header */}
      <header className='border-b'>
        <div className='container mx-auto px-4 py-4 flex items-center justify-between'>
          <div className='flex items-center space-x-2'>
            <Car className='h-8 w-8 text-primary' />
            <span className='text-2xl font-bold'>SmartPark</span>
          </div>
          <div className='flex items-center space-x-4'>
            <Link href='/auth/login'>
              <Button variant='ghost' className='cursor-pointer'>Login</Button>
            </Link>
            <Link href='/auth/register'>
              <Button className='cursor-pointer'>Get Started</Button>
            </Link>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className='flex items-center justify-center min-h-[calc(100vh-80px)]'>
        <div className='container mx-auto px-4 text-center'>
          <h1 className='text-6xl font-bold mb-6'>Smart Parking Made Simple</h1>
          <p className='text-xl text-muted-foreground mb-8 max-w-2xl mx-auto'>
            Find, reserve, and pay for parking spots in real-time. Never circle the block looking for parking again.
          </p>
          <div className='flex justify-center space-x-4'>
            <Link href='/auth/register'>
              <Button size='lg' className='px-8 cursor-pointer'>
                Start Parking Smart
              </Button>
            </Link>
            <Link href='/locations'>
              <Button size='lg' variant='outline' className='px-8 cursor-pointer'>
                View Locations
              </Button>
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
