import { AddLocationSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';

type AddLocationFormValues = z.infer<typeof AddLocationSchema>;

const AddLocationForm = ({ setIsOpen }: { setIsOpen: React.Dispatch<React.SetStateAction<boolean>> }) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AddLocationFormValues>({
    resolver: zodResolver(AddLocationSchema)
  });

  const onSubmit = async (data: AddLocationFormValues) => {
    console.log('Form submitted:', data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className='space-y-4'>
      <div className='space-y-2'>
        <Label htmlFor='name'>Location Name</Label>
        <div>
          <Input id='name' {...register('name')} />
          {errors.name && <p className='text-red-500 text-sm mt-1'>{errors.name.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='location'>Address</Label>
        <div>
          <Input id='location' {...register('location')} />
          {errors.location && <p className='text-red-500 text-sm mt-1'>{errors.location.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='total_slots'>Total Slots</Label>
        <div>
          <Input id='total_slots' type='number' min={2} {...register('total_slots')} />
          {errors.total_slots && <p className='text-red-500 text-sm mt-1'>{errors.total_slots.message}</p>}
        </div>
      </div>

      <div className='flex justify-end'>
        <div className='flex items-center gap-4'>
          <Button type='button' variant='outline' onClick={() => setIsOpen(false)}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {isSubmitting ? 'Adding...' : 'Add Location'}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddLocationForm;
