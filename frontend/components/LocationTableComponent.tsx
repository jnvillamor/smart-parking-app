'use client';

import React, { useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import LocationTableActionButton from './LocationTableActionButton';
import LocationTableStatusButton from './LocationTableStatusButton';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Button } from './ui/button';
import { MapPin, Plus } from 'lucide-react';
import AddLocationForm from './forms/AddLocationForm';
import { PaginatedParkingLocations, ParkingLocation } from '@/lib/types';
import Pagination from './Pagination';

const LocationTableComponent = ({ locationsData }: { locationsData: PaginatedParkingLocations }) => {
  const [isOpenDialog, setIsOpenDialog] = React.useState<boolean>(false);
  const [editingLocation, setEditingLocation] = React.useState<number | null>(null);
  const [locationToEdit, setLocationToEdit] = React.useState<ParkingLocation | undefined>(undefined);

  useEffect(() => {
    if (editingLocation !== null) {
      console.log('Editing location:', editingLocation);
      const loc = locationsData.parking_lots.find((l) => l.id === editingLocation);
      setLocationToEdit(loc || undefined);
      setIsOpenDialog(true);
    } else {
      setLocationToEdit(undefined);
    }
  }, [editingLocation, locationsData.parking_lots]);

  return (
    <Card>
      <CardHeader className='flex items-center justify-between space-y-0 pb-2 gap-4'>
        <div className='space-y-2'>
          <CardTitle className='text-2xl font-semibold leading-none tracking-tight'>All Parking Locations ({locationsData.total})</CardTitle>
          <CardDescription>Manage your parking locations and their settings</CardDescription>
        </div>
        <Dialog open={isOpenDialog} onOpenChange={setIsOpenDialog}>
          <DialogTrigger asChild>
            <Button className='cursor-pointer'>
              <Plus className='h-4 w-4' />
              <span className='hidden md:inline'>Add Location</span>
            </Button>
          </DialogTrigger>

          <DialogContent>
            <DialogHeader>
              <DialogTitle>{editingLocation ? 'Edit' : 'Add New'} Parking Location</DialogTitle>
              <DialogDescription>
                {editingLocation ? 'Update the parking location details below.' : 'Enter the details for the new parking location.'}
              </DialogDescription>
            </DialogHeader>

            {/* Form */}
            <AddLocationForm setIsOpen={setIsOpenDialog} setEditingLocation={setEditingLocation} defaultValues={locationToEdit} />
          </DialogContent>
        </Dialog>
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
            {locationsData.parking_lots.map((loc) => (
              <TableRow key={loc.id}>
                <TableCell className='p-4 align-middle font-medium'>{loc.name}</TableCell>
                <TableCell className='p-4 align-middle'>{loc.location}</TableCell>
                <TableCell className='p-4 align-middle'>
                  <span className='text-green-500'>{loc.available_slots}</span>/<span>{loc.total_slots}</span>
                </TableCell>
                <TableCell className='p-4 align-middle'>${loc.rate.toFixed(2)}</TableCell>
                <TableCell className='p-4 align-middle'>
                  <LocationTableStatusButton loc={loc} />
                </TableCell>
                <TableCell className='p-4 align-middle'>
                  <LocationTableActionButton location_id={loc.id} setIsOpenDialog={setIsOpenDialog} setEditingLocation={setEditingLocation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
        {locationsData.parking_lots.length > 0 && <Pagination type='locations' data={locationsData} />}
        {locationsData.parking_lots.length === 0 && (
          <div className='text-center py-12'>
            <MapPin className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No locations found</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LocationTableComponent;
