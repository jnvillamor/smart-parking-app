"use client";

import React from 'react'
import { Button } from './ui/button'
import { ArrowUpDown } from 'lucide-react'
import { useRouter, useSearchParams } from 'next/navigation';

const SortingButton = ({ title }: { title: string }) => {
  const searchParams = useSearchParams();
  const router = useRouter();

  const handleSort = () => {
    const params = new URLSearchParams(searchParams.toString());
    const currentOrder = searchParams.get('order') || 'asc';
    const currentSort = searchParams.get('sort') || 'id';

    if (currentSort === title) {
      if (currentOrder === 'asc') {
        params.set('order', 'desc');
      } else {
        params.set('order', 'asc');
      }
    } else {
      params.set('sort', title);
      params.set('order', 'asc');
      params.set('page', '1');
    }

    // Update the URL with the new search parameters
    router.push(`/admin/reservations?${params.toString()}`);
  }  
  return (
    <Button onClick={() => handleSort()} variant='ghost' className='cursor-pointer'>
      {title == 'id' ? title.toUpperCase() : title.charAt(0).toUpperCase() + title.slice(1)}
      <ArrowUpDown className='h-4 w-4' />
    </Button>
  )
}

export default SortingButton