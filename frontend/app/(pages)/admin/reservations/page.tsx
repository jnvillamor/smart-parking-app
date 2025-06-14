import ReservationFilters from '@/components/ReservationPage/ReservationFilters';
import ReservationSummaryCard from '@/components/ReservationPage/ReservationSummaryCard';
import ReservationTable from '@/components/ReservationPage/ReservationTable';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { SearchParams } from 'next/dist/server/request/search-params';
import React from 'react';

const ReservationPage = async ({ searchParams }: { searchParams: Promise<SearchParams>}) => {
  const params = await searchParams;
  
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>Reservations Management</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Summary Cards */}
        <ReservationSummaryCard />

        {/* Filters Section */}
        <ReservationFilters /> 

        {/* Reservation Table */}
        <ReservationTable params={params}/>
      </div>
    </>
  );
};

export default ReservationPage;
