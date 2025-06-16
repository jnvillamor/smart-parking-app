import { authOptions } from '@/app/api/auth/options';
import Pagination from '@/components/Pagination';
import LocationFilter from '@/components/UserLocations/LocationFilter';
import ReserveButton from '@/components/UserLocations/ReserveButton';
import { Card, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getParkingLocations } from '@/lib/parking';
import { Car, DollarSign, MapPin } from 'lucide-react';
import { getServerSession } from 'next-auth';
import { SearchParams } from 'next/dist/server/request/search-params';
import React from 'react';

export const metadata = {
  title: 'Find Parking',
  description: 'Browse available parking locations and reserve spots in real-time.',
};

const Locations = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  const parkings = await getParkingLocations({ ...params, status: 'active' });
  const session = await getServerSession(authOptions);

  if (!session) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>You must be logged in to view parking locations.</p>
      </div>
    );
  }

  if (!parkings.success || !parkings.data) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>Error: {parkings.message}</p>
      </div>
    );
  }

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>Find Parking</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Filter */}
        <LocationFilter />

        {/* Parking */}
        <div className='grid gap-4 md:grid-cols-2 lg:grid-cols-3'>
          {parkings.data.parking_lots.map((parking) => (
            <Card key={parking.id} className='hover:shadow-lg transition-shadow'>
              <CardHeader>
                <div>
                  <CardTitle className='text-lg'>{parking.name}</CardTitle>
                  <CardDescription className='flex items-center mt-1'>
                    <MapPin className='h-3 w-3 mr-1' />
                    {parking.location}
                  </CardDescription>
                </div>
              </CardHeader>
              <CardHeader>
                <div className='space-y-3'>
                  <div className='flex items-center justify-between'>
                    <div className='flex items-center space-x-2'>
                      <Car className='h-4 w-4 text-green-600' />
                      <span className='text-sm'>
                        <span className='font-semibold text-green-600'>{parking.available_slots}</span>/{parking.total_slots} available
                      </span>
                    </div>
                    <div className='flex items-center space-x-1'>
                      <DollarSign className='h-4 w-4 text-yellow-600' />
                      <span className='font-semibold'>${parking.rate}/hr</span>
                    </div>
                  </div>
                  <div className='flex justify-end'>
                    <ReserveButton parking={parking} userId={session.user.id} />
                  </div>
                </div>
              </CardHeader>
            </Card>
          ))}
        </div>
      </div>
      {/* Align below the page */}
      <div className='mt-4'>
        <Pagination type='locations' data={parkings.data} />
      </div>
    </>
  );
};

export default Locations;
