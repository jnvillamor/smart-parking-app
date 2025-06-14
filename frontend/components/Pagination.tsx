'use client';

import { ParkingLocation, Reservation } from '@/lib/types';
import React from 'react';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Button } from './ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

type PaginationProps = {
  type: 'locations' | 'users' | 'reservations';
  data: {
    total: number;
    page: number;
    limit: number;
    has_next: boolean;
    has_previous: boolean;
    total_pages: number;
    parking_lots?: ParkingLocation[];
    reservations?: Reservation[];
  };
};

const Pagination = ({ type, data }: PaginationProps) => {
  const [itemsPerPage, setItemsPerPage] = React.useState(data.limit);
  const [currentPage, setCurrentPage] = React.useState(data.page);
  const searchParams = useSearchParams();
  const router = useRouter();

  React.useEffect(() => {
    const updateSearchParams = () => {
      const params = new URLSearchParams(searchParams.toString());
      params.set('page', currentPage.toString());
      params.set('limit', itemsPerPage.toString());

      router.push(`/admin/${type}?${params.toString()}`);
    };

    updateSearchParams();
  }, [itemsPerPage, currentPage, searchParams, router, type]);

  const getMinPage = () => {
    switch (type) {
      case 'locations':
        return Math.min(data.page * data.limit, data.parking_lots?.length || 0);
      case 'reservations':
        return Math.min(data.page * data.limit, data.reservations?.length || 0);
    }
    return Math.min(data.page * data.limit, data.total);
  }

  return (
    <div className='flex flex-col gap-5 md:flex-row items-center justify-between px-2 py-4'>
      <div className='flex items-center space-x-2'>
        <p className='text-sm text-muted-foreground'>
          Showing {(data.page - 1) * data.limit + 1} to {getMinPage()} of {data.total} {type}
        </p>
        <Select value={itemsPerPage.toString()} onValueChange={(value) => setItemsPerPage(parseInt(value))}>
          <SelectTrigger className='w-20'>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value='5'>5</SelectItem>
            <SelectItem value='10'>10</SelectItem>
            <SelectItem value='20'>20</SelectItem>
          </SelectContent>
        </Select>
        <span className='text-sm text-muted-foreground'>per page.</span>
      </div>
      <div className='flex items-center space-x-2'>
        <Button
          variant='outline'
          size='sm'
          disabled={!data.has_previous}
          onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
          className='cursor-pointer'>
          <ChevronLeft className='h-4 w-4' /> <span className="hidden md:inline">Previous</span> 
        </Button>
        {Array.from({ length: Math.min(5, data.total_pages) }, (_, i) => {
          let pageNumber;
          if (data.total_pages <= 5) {
            pageNumber = i + 1;
          } else if (currentPage <= 3) {
            pageNumber = i + 1;
          } else if (currentPage >= data.total_pages - 2) {
            pageNumber = data.total_pages - 4 + i;
          } else {
            pageNumber = currentPage - 2 + i;
          }

          return (
            <Button
              key={pageNumber}
              variant={currentPage === pageNumber ? 'default' : 'outline'}
              size='sm'
              onClick={() => setCurrentPage(pageNumber)}
              className='w-8 h-8 p-0 cursor-pointer'>
              {pageNumber}
            </Button>
          );
        })}
        <Button
          variant='outline'
          size='sm'
          disabled={!data.has_next}
          onClick={() => setCurrentPage((prev) => Math.min(data.total_pages, prev + 1))}
          className='cursor-pointer'>
            <span className='hidden md:inline'>
              Next
            </span>
          <ChevronRight className='h-4 w-4' />
        </Button>
      </div>
    </div>
  );
};

export default Pagination;
