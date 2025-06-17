'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { usePathname, useRouter, useSearchParams } from 'next/navigation';
import { Label } from '../ui/label';
import { Filter, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const LocationFilters = () => {
  const pahtname = usePathname();
  const router = useRouter();
  const searchParams = useSearchParams();
  const [name, setName] = React.useState<string>(searchParams.get('name') || "");
  const [status, setStatus] = React.useState<string>(searchParams.get('status') || 'all');

  useEffect(() => {
    // If the name changes, wait for a short delay before updating the URL
    const timer = setTimeout(() => {
      const params = new URLSearchParams(searchParams.toString());
      console.log('Current search params:', params.toString());
      console.log('Current name:', name);
      console.log('Current status:', status);

      const currentName = searchParams.get('name') || "";
      const currentStatus = searchParams.get('status') || 'all';

      const filtersChanged = currentName !== name || currentStatus !== status;

      if (name) {
        params.set('name', name);
      } else {
        params.delete('name');
      }

      if (status) {
        params.set('status', status);
      } else {
        params.delete('status');
      }

      if(filtersChanged) params.set('page', '1');

      // Update the URL with the new search parameters
      router.push(`${pahtname}?${params.toString()}`);
    }, 250);

    return () => clearTimeout(timer);
  }, [name, status, router, searchParams, pahtname]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold leading-none tracking-tight'>Fiters</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>Filter locations by name, address, or status</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className='space-y-2'>
            <Label htmlFor='search'>Search</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='search'
                placeholder='Search by name or address...'
                value={name || ''}
                onChange={(e) => setName(e.target.value)}
                className='pl-10'
              />
            </div>
          </div>
          <div className='space-y-2'>
            <Label htmlFor='status'>Status</Label>
            <Select value={status} onValueChange={setStatus} defaultValue='all'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='All statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='active'>Active</SelectItem>
                <SelectItem value='inactive'>Inactive</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>&nbsp;</Label>
            <Button
              variant='outline'
              onClick={() => router.push(`${pahtname}`)}
              className='w-full'>
              <Filter className='h-4 w-4' />
              Clear Filters
            </Button>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default LocationFilters;
