'use client';

import React from 'react';
import { Button } from './ui/button';
import { Edit, Trash } from 'lucide-react';
import { deleteParkingLocation } from '@/lib/parking';
import { toast } from 'sonner';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from './ui/alert-dialog';

const LocationTableActionButton = ({
  location_id,
  setEditingLocation,
  setIsOpenDialog
}: {
  location_id: number;
  setEditingLocation: React.Dispatch<React.SetStateAction<number | null>>;
  setIsOpenDialog: React.Dispatch<React.SetStateAction<boolean>>;
}) => {
  const [open, setOpen] = React.useState(false);
  const [isDeleting, setIsDeleting] = React.useState(false);

  const handleDelete = async () => {
    setIsDeleting(true);
    const res = await deleteParkingLocation(location_id);

    if (res.success) {
      toast.success('Parking location deleted successfully');
    } else {
      toast.error('Failed to delete parking location:', res.message);
    }

    setIsDeleting(false);
    setOpen(false);
  };

  const handleEdit = () => {
    setEditingLocation(location_id);
    setIsOpenDialog(true);
  }

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogContent>
        <AlertDialogHeader>
          <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
          <AlertDialogDescription>
            This action cannot be undone. This will permanently delete the parking location and remove its data from our servers.
          </AlertDialogDescription>
        </AlertDialogHeader>
        <AlertDialogFooter>
          <AlertDialogCancel className='cursor-pointer'>Cancel</AlertDialogCancel>
          <Button variant='destructive' className='cursor-pointer' onClick={() => handleDelete()} disabled={isDeleting}>
            {isDeleting ? 'Deleting...' : 'Continue'}
          </Button>
        </AlertDialogFooter>
      </AlertDialogContent>

      <div className='flex items-center gap-2'>
        <Button onClick={() => handleEdit()} variant='outline' size='sm' className='cursor-pointer'>
          <Edit className='h-4 w-4' />
        </Button>
        <AlertDialogTrigger asChild>
          <Button variant='outline' size='sm' className='cursor-pointer'>
            <Trash className='h-4 w-4' />
          </Button>
        </AlertDialogTrigger>
      </div>
    </AlertDialog>
  );
};

export default LocationTableActionButton;
