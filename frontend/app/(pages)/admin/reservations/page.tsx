import ReservationSummaryCard from '@/components/ReservationSummaryCard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

const ReservationPage = () => {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>Reservations Management</h1>
        </div>
      </header>
      <ReservationSummaryCard />
    </>
  );
};

export default ReservationPage;
