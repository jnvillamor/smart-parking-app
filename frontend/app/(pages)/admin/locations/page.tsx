import LocationSummaryCards from '@/components/LocationPage/LocationSummaryCards';
import LocationTable from '@/components/LocationPage/LocationTable';
import { SidebarTrigger } from '@/components/ui/sidebar'
import { SearchParams } from 'next/dist/server/request/search-params'
import React from 'react'

export const metadata = {
  title: 'Parking Locations',
  description: 'Manage and view all parking locations in the system.'
};

const LocationPage = async ({ searchParams }: { searchParams: Promise<SearchParams>}) => {
  const params = await searchParams;
  return (
    <>
      <header className="flex h-16 shrink-0 items-center gap-2 border-b px-4">
        <SidebarTrigger className="-ml-1" />
        <div className="flex justify-between w-full">
          <h1 className="text-xl font-semibold">Parking Locations</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Summary Cards */}
        <LocationSummaryCards />

        {/* Location Table */}
        <LocationTable  searchParams={params}/>
      </div>
    </>
  )
}

export default LocationPage