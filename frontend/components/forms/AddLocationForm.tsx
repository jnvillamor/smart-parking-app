import { AddLocationSchema } from '@/lib/schema';
import { zodResolver } from '@hookform/resolvers/zod';
import React from 'react';
import { useForm } from 'react-hook-form';
import { z } from 'zod';
import { Label } from '../ui/label';
import { Input } from '../ui/input';
import { Button } from '../ui/button';
import { createParkingLocation, updateParkingLocation } from '@/lib/parking';
import { toast } from 'sonner';
import { ParkingLocation } from '@/lib/types';

type AddLocationFormValues = z.infer<typeof AddLocationSchema>;
interface AddLocationFormProps {
  setIsOpen: React.Dispatch<React.SetStateAction<boolean>>;
  setEditingLocation?: React.Dispatch<React.SetStateAction<number | null>>;
  defaultValues?: ParkingLocation;
}

const AddLocationForm = ({ setIsOpen, setEditingLocation, defaultValues }: AddLocationFormProps) => {
  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting }
  } = useForm<AddLocationFormValues>({
    resolver: zodResolver(AddLocationSchema),
    defaultValues: {
      name: defaultValues?.name || '',
      location: defaultValues?.location || '',
      total_slots: defaultValues?.total_slots || 2,
      rate: defaultValues?.rate || 2
    }
  });

  const onSubmit = async (data: AddLocationFormValues) => {
    let res;
    if( defaultValues && defaultValues.id ) {
      res = await updateParkingLocation(defaultValues.id, data);
    }
    else {
      res = await createParkingLocation(data);
    }
    
    if (res.success) {
      setIsOpen(false);
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }

    if (setEditingLocation) {
      setEditingLocation(null);
    }
  };

  const handleCancel = () => {
    setIsOpen(false);
    if (setEditingLocation) {
      setEditingLocation(null);
    }
  }

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
          <Input id='total_slots' type='number' min={2} {...register('total_slots', { valueAsNumber: true })} />
          {errors.total_slots && <p className='text-red-500 text-sm mt-1'>{errors.total_slots.message}</p>}
        </div>
      </div>

      <div className='space-y-2'>
        <Label htmlFor='rate'>Rate ($/hr)</Label>
        <div>
          <Input id='rate' type='number' step="any" min={2} {...register('rate', { valueAsNumber: true })} />
          {errors.rate && <p className='text-red-500 text-sm mt-1'>{errors.rate.message}</p>}
        </div>
      </div>

      <div className='flex justify-end'>
        <div className='flex items-center gap-4'>
          <Button type='button' variant='outline' onClick={() => handleCancel()}>
            Cancel
          </Button>
          <Button type='submit' disabled={isSubmitting}>
            {defaultValues ? (isSubmitting ? 'Updating...' : 'Update Location') : (isSubmitting ? 'Creating...' : 'Add Location')}
          </Button>
        </div>
      </div>
    </form>
  );
};

export default AddLocationForm;
