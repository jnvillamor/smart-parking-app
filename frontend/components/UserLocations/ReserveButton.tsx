'use client';
import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { ParkingLocation } from '@/lib/types';
import AddReservationForm from '../forms/AddReservationForm';

const ReserveButton = ({ parking, userId }: { parking: ParkingLocation, userId: number }) => {
  const [isOpen, setIsOpen] = React.useState<boolean>(false);
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button variant='default' className='cursor-pointer'>
          Reserve
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Reserve Parking Spot</DialogTitle>
          <DialogDescription>Reserve your parking spot at {parking.name}</DialogDescription>
        </DialogHeader>
        <AddReservationForm parking={parking} userId={userId} setIsOpen={setIsOpen} />
      </DialogContent>
    </Dialog>
  );
};

export default ReserveButton;
