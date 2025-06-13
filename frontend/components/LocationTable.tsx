import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { getParkingLocations } from '@/lib/parking';
import { Badge } from './ui/badge';
import LocationTableActionButton from './LocationTableActionButton';

const LocationTable = async () => {
  const locationsData = await getParkingLocations();
  if (!locationsData.success) {
    return <div className='text-red-500'>{locationsData.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-2xl font-semibold leading-none tracking-tight'>All Parking Locations</CardTitle>
        <CardDescription>Manage your parking locations and their settings</CardDescription>
      </CardHeader>

      <CardContent>
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Name</TableHead>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Address</TableHead>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Slots</TableHead>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Rate/Hour</TableHead>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Status</TableHead>
              <TableHead className='h-12 px-4 text-left align-middle font-medium text-muted-foreground'>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {locationsData.data?.parking_lots.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className="p-4 align-middle font-medium">{loc.name}</TableCell>
                <TableCell className="p-4 align-middle">{loc.location}</TableCell>
                <TableCell className="p-4 align-middle">
                  <span className='text-green-500'>{loc.available_slots}</span>/<span>{loc.total_slots}</span>
                </TableCell>
                <TableCell className="p-4 align-middle">${loc.rate.toFixed(2)}</TableCell>
                <TableCell className="p-4 align-middle">
                  <Badge variant={loc.is_active ? 'default' : 'secondary'}>{loc.is_active ? 'Active' : 'Inactive'}</Badge>
                </TableCell>
                <TableCell className="p-4 align-middle">
                  <LocationTableActionButton location_id={loc.id} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default LocationTable;
