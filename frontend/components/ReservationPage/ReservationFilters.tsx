'use client';

import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { useRouter, useSearchParams } from 'next/navigation';
import { Label } from '../ui/label';
import { Filter, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';

const ReservationFilters = () => {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [searchTerm, setSearchTerm] = React.useState<string>('');
  const [status, setStatus] = React.useState<string>(searchParams.get('status') || 'all');

  React.useEffect(() => {
    const handleSearch = () => {
      const newParams = new URLSearchParams(searchParams.toString());
      if (searchTerm) {
        newParams.set('term', searchTerm);
      } else {
        newParams.delete('term');
      }

      newParams.set('status', status);

      router.push(`/admin/reservations?${newParams.toString()}`);
    }

    handleSearch();
  }, [searchTerm, status])

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold leading-none tracking-tight'>Fiters</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>Filter reservations by search term, status, or location</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='grid gap-4 md:grid-cols-3'>
          <div className="space-y-2">
            <Label htmlFor='search'>Search</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='search'
                placeholder='Search by reservation ID, user email, or location name'
                className='pl-10'
                onChange={(e) => {
                  setSearchTerm(e.target.value);
                }}
              />
            </div>
          </div>
          <div className="space-y-2">
            <Label>Status</Label>
            <Select value={status} onValueChange={(value) => {setStatus(value)}}>
              <SelectTrigger className='w-full'>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Statuses</SelectItem>
                <SelectItem value='active'>Active Reservations</SelectItem>
                <SelectItem value='upcoming'>Upcoming Reservations</SelectItem>
                <SelectItem value='completed'>Completed Reservations</SelectItem>
              </SelectContent>
            </Select>
          </div>
          <div className='space-y-2'>
            <Label>&nbsp;</Label>
            <Button
              variant='outline'
              onClick={() => {
              }}
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

export default ReservationFilters;
