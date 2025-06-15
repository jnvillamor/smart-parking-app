"use client";

import React, { useEffect } from 'react';
import { Input } from '../ui/input';
import { Search } from 'lucide-react';
import { useRouter, useSearchParams } from 'next/navigation';

const LocationFilter = () => {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [query, setQuery] = React.useState('');

  useEffect(() => {
    // Wait for a short delay before updating the URL
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());

      if (query) {
        params.set('name', query);
      } else {
        params.delete('name');
      }

      // Update the URL with the new search parameters
      router.push(`/locations?${params.toString()}`);
    }, 250);

    return () => clearTimeout(timer);
  }, [query, searchParams, router]);

  return (
    <div className='relative'>
      <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
      <Input
        placeholder='Search by location name or address...'
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className='pl-10'
      />
    </div>
  );
};

export default LocationFilter;
