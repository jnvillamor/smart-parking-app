'use client';
import { AddReservationSchema } from '@/lib/schema';
import { ParkingLocation } from '@/lib/types';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Button } from '../ui/button';
import { toast } from 'sonner';
import { createReservation } from '@/lib/reservation';

type AddReservationInputs = z.infer<typeof AddReservationSchema>;

const AddReservationForm = ({
  parking,
  userId,
  setIsOpen
}: {
  parking: ParkingLocation;
  userId: number;
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AddReservationInputs>({
    resolver: zodResolver(AddReservationSchema)
  });

  const handleCreateReservation = async (data: AddReservationInputs) => {
    const res = await createReservation(data);
    if (res.success) {
      toast.success('Reservation created successfully');
      setIsOpen(false);
    } else {
      toast.error(`Failed to create reservation: ${res.message}`);
    }
  };

  return (
    <form onSubmit={handleSubmit(handleCreateReservation)} className='space-y-4'>
      <div>
        <Input type='hidden' {...register('parking_id', { valueAsNumber: true })} value={parking.id} />
        {errors.parking_id && <p className='text-red-500 text-sm mt-1'>{errors.parking_id.message}</p>}
      </div>
      <div>
        <Input type='hidden' {...register('user_id', { valueAsNumber: true })} value={userId} />
        {errors.user_id && <p className='text-red-500 text-sm mt-1'>{errors.user_id.message}</p>}
      </div>

      <div className='p-4 bg-accent rounded-lg'>
        <h3 className='font-semibold'>{parking.name}</h3>
        <p className='text-sm text-muted-foreground'>{parking.location}</p>
        <p className='text-sm font-medium mt-1'>${parking.rate}/hour</p>
      </div>
      <div className='grid md:grid-cols-2 gap-4'>
        <div className='space-y-2'>
          <Label htmlFor='start_time'>Start Time</Label>
          <div>
            <Input type='datetime-local' {...register('start_time')} className='w-full' />
            {errors.start_time && <p className='text-red-500 text-sm mt-1'>{errors.start_time.message}</p>}
          </div>
        </div>
        <div className='space-y-2'>
          <Label htmlFor='end_time'>End Time</Label>
          <div>
            <Input type='datetime-local' {...register('end_time')} className='w-full' />
            {errors.end_time && <p className='text-red-500 text-sm mt-1'>{errors.end_time.message}</p>}
            {/* {errors.root && <p className='text-red-500 text-sm mt-1'>{errors.root.message}</p>} */}
          </div>
        </div>
      </div>
      <div className='flex justify-end w-full gap-4'>
        <Button type='button' variant='outline' className='cursor-pointer' onClick={() => setIsOpen(false)}>
          Cancel
        </Button>
        <Button type='submit' disabled={isSubmitting} className='cursor-pointer'>
          {isSubmitting ? 'Creating...' : 'Create Reservation'}
        </Button>
      </div>
    </form>
  );
};

export default AddReservationForm;
