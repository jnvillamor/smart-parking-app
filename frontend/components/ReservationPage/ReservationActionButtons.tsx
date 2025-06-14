'use client';

import { Reservation } from '@/lib/types';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Clock, Eye, MapPin, User, X } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '../ui/label';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import { cancelReservation } from '@/lib/reservation';
import { toast } from 'sonner';

const ReservationActionButtons = ({ reservation }: { reservation: Reservation }) => {
  const [isCancelling, setIsCancelling] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);

  const handleCancelReservation = async () => {
    setIsCancelling(true);
    const res = await cancelReservation(reservation.id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsCancelling(false);
    setIsOpen(false);
  };
  return (
    <div className='flex space-x-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm' className='cursor-pointer'>
            <Eye className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='font-medium'>Reservation Details</DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>Complete information for reservation #{reservation.id}</DialogDescription>
          </DialogHeader>
          <div className='space-y-4'>
            <div className='grid grid-cols-2 gap-6'>
              <div className='space-y-3'>
                <div>
                  <Label className='text-sm font-medium'>User Information</Label>
                  <div className='mt-1 space-y-1'>
                    <p className='flex items-center text-sm'>
                      <User className='h-3 w-3 mr-2' />
                      {reservation.user.full_name}
                    </p>
                    <p className='text-sm text-muted-foreground'>{reservation.user.email}</p>
                  </div>
                </div>
                <div>
                  <Label className='text-sm font-medium'>Location</Label>
                  <div className='mt-1 space-y-1'>
                    <p className='flex items-center text-sm'>
                      <MapPin className='h-3 w-3 mr-2' />
                      {reservation.parking.name}
                    </p>
                    <p className='text-sm text-muted-foreground'>{reservation.parking.location}</p>
                  </div>
                </div>
              </div>
              <div className='space-y-3'>
                <div>
                  <Label className='text-sm font-medium'>Timing</Label>
                  <div className='mt-1 space-y-1'>
                    <p className='flex items-center text-sm'>
                      <Clock className='h-3 w-3 mr-2' />
                      Start: {new Date(reservation.start_time).toLocaleString()}
                    </p>
                    <p className='text-sm'>End: {new Date(reservation.end_time).toLocaleString()}</p>
                    <p className='text-sm'>Duration: {reservation.duration.toFixed(2)} hours</p>
                  </div>
                </div>
                <div>
                  <Label className='text-sm font-medium'>Payment</Label>
                  <div className='mt-1 space-y-1'>
                    <p className='text-sm'>Total Cost: ${reservation.total_cost.toFixed(2)}</p>
                  </div>
                </div>
                <div>
                  <Label className='text-sm font-medium'>Status</Label>
                  <div className='mt-1'></div>
                </div>
              </div>
            </div>
            <div>
              <Label className='text-sm font-medium'>Booking Information</Label>
              <p className='text-sm text-muted-foreground mt-1'>Booked on: {new Date(reservation.created_at).toLocaleString()}</p>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {reservation.status === 'Upcoming' && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button variant='destructive' size='sm'>
              <X className='h-4 w-4' />
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to cancel reservation #{reservation.id} for {reservation.user.full_name}? This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Keep Reservation</AlertDialogCancel>
              <Button disabled={isCancelling} variant='destructive' onClick={() => handleCancelReservation()}>
                {isCancelling ? 'Cancelling...' : 'Confirm Cancellation'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ReservationActionButtons;
