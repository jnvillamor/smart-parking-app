'use client';

import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { AlertDialog, AlertDialogCancel, AlertDialogContent, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Button } from './ui/button';
import { getStatusBadge } from '@/lib/helper';
import { MapPin } from 'lucide-react';
import { Reservation } from '@/lib/types';
import { cancelReservation } from '@/lib/reservation';
import { toast } from 'sonner';

const ReservationCardActionButtons = ({ reservation }: { reservation: Reservation }) => {
  const [isCancelling, setIsCancelling] = React.useState<boolean>(false);
  const [isOpen, setIsOpen] = React.useState<boolean>(false);

  const handleCancelReservation = async () => {
    setIsCancelling(true);
    const res = await cancelReservation(reservation.id);
    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsCancelling(false);
  };

  return (
    <div className='flex justify-end mt-3 space-x-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button className='cursor-pointer' variant='outline' size='sm'>
            View Details
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <AlertDialogHeader>
            <DialogTitle>Reservation Details</DialogTitle>
            <DialogDescription>Complete information for your parking reservation</DialogDescription>
          </AlertDialogHeader>

          <div className='space-y-6'>
            <div className='grid grid-cols-2 gap-12'>
              <div className='space-y-4'>
                <div>
                  <h3 className='font-semibold text-lg'>{reservation.parking.name}</h3>
                  <p className='text-muted-foreground flex items-center'>
                    <MapPin className='h-4 w-4 mr-2' />
                    {reservation.parking.location}
                  </p>
                  {getStatusBadge(reservation.status)}
                </div>

                <div>
                  <h4 className='font-medium mb-2'>Parking Information</h4>
                  <div className='space-y-2'>
                    <div className='flex justify-between'>
                      <span className='text-muted-foreground'>Total Cost:</span>
                      <span className='font-medium'>${reservation.total_cost.toFixed(2)}</span>
                    </div>
                  </div>
                </div>
              </div>

              <div className='space-y-4'>
                <div>
                  <h4 className='font-medium mb-2'>Timing Details</h4>
                  <div className='space-y-2'>
                    <div>
                      <span className='text-muted-foreground block'>Start Time:</span>
                      <span className='font-medium'>{new Date(reservation.start_time).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground block'>End Time:</span>
                      <span className='font-medium'>{new Date(reservation.end_time).toLocaleString()}</span>
                    </div>
                    <div>
                      <span className='text-muted-foreground block'>Duration:</span>
                      <span className='font-medium'>{reservation.duration_hours.toFixed(2)} hours</span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
            <div className='border-t pt-4'>
              <h4 className='font-medium mb-2'>Additional Information</h4>
              <div className='text-sm text-muted-foreground space-y-1'>
                <p>• Please arrive within 15 minutes of your start time</p>
                <p>• Contact support if you need to modify your reservation</p>
                <p>• Late arrivals may result in slot reassignment</p>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {reservation.status === 'Upcoming' && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button disabled={isCancelling} className='cursor-pointer' variant='destructive' size='sm' onClick={() => setIsOpen(true)}>
              {isCancelling ? 'Cancelling...' : 'Cancel'}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Cancel Reservation</AlertDialogTitle>
              <p className='text-sm text-muted-foreground'>Are you sure you want to cancel this reservation? This action cannot be undone.</p>
              <div className='mt-4'>
                <p className='text-sm'>Reservation ID: #{reservation.id}</p>
                <p className='text-sm'>Parking: {reservation.parking.name}</p>
                <p className='text-sm'>Location: {reservation.parking.location}</p>
              </div>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
              <Button className='cursor-pointer' disabled={isCancelling} variant='destructive' onClick={() => handleCancelReservation()}>
                {isCancelling ? 'Cancelling...' : 'Confirm'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default ReservationCardActionButtons;
