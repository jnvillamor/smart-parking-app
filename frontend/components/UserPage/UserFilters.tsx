'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Label } from '../ui/label';
import { Filter, Search } from 'lucide-react';
import { Input } from '../ui/input';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { Button } from '../ui/button';
import { useRouter, useSearchParams } from 'next/navigation';

const UserFilters = () => {
  const searchParmams = useSearchParams();
  const router = useRouter();
  const [query, setQuery] = React.useState<string>(searchParmams.get('q') || '');
  const [status, setStatus] = React.useState<string>(searchParmams.get('statuts') || 'all');
  const [role, setRole] = React.useState<string>(searchParmams.get('role') || 'all');

  useEffect(() => {
    const handleChange = () => {
      const params = new URLSearchParams(searchParmams.toString());

      const currentQuery = searchParmams.get('q') || '';
      const currentStatus = searchParmams.get('statuts') || 'all';
      const currentRole = searchParmams.get('role') || 'all';

      const filtersChanged = currentQuery !== query || currentStatus !== status || currentRole !== role;

      if (query) {
        params.set('q', query);
      } else {
        params.delete('q');
      }

      if (status && status !== 'all') {
        params.set('statuts', status);
      } else {
        params.delete('statuts');
      }

      if (role && role !== 'all') {
        params.set('role', role);
      } else {
        params.delete('role');
      }

      if (filtersChanged) params.set('page', '1');

      // Update the URL with the new search parameters
      router.push(`/admin/users?${params.toString()}`);
    };

    handleChange();
  }, [query, status, role, router, searchParmams]);

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold leading-none tracking-tight'>Fiters</CardTitle>
        <CardDescription className='text-sm text-muted-foreground'>Filter locations by name, address, or status</CardDescription>
      </CardHeader>

      <CardContent>
        <div className='grid gap-4 md:grid-cols-4'>
          <div className='space-y-2'>
            <Label htmlFor='search'>Search</Label>
            <div className='relative'>
              <Search className='absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4' />
              <Input
                id='search'
                placeholder='Search by name or address...'
                value={query || ''}
                onChange={(e) => setQuery(e.target.value)}
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
            <Label htmlFor='role'>Role</Label>
            <Select value={role} onValueChange={setRole} defaultValue='all'>
              <SelectTrigger className='w-full'>
                <SelectValue placeholder='All statuses' />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value='all'>All Roles</SelectItem>
                <SelectItem value='admin'>Admin</SelectItem>
                <SelectItem value='user'>Users</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className='space-y-2'>
            <Label>&nbsp;</Label>
            <Button
              variant='outline'
              onClick={() => {
                setQuery('');
                setStatus('all');
                setRole('all');
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

export default UserFilters;
