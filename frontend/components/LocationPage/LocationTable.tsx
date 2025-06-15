import { getParkingLocations } from '@/lib/parking';
import React from 'react';
import LocationTableComponent from './LocationTableComponent';
import LocationFilters from './LocationFilters';
import { SearchParams } from 'next/dist/server/request/search-params';

const LocationTable = async ({ searchParams }: { searchParams: SearchParams }) => {
  const locationsData = await getParkingLocations(searchParams);

  if (!locationsData.success || !locationsData.data) {
    return (
      <div className='p-4'>
        <p className='text-red-500'>Error: {locationsData.message}</p>
      </div>
    );
  }

  return (
    <>
      <LocationFilters />
      <LocationTableComponent locationsData={locationsData?.data} />
    </>
  );
};

export default LocationTable;
