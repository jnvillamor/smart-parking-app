"use client";

import { useState } from 'react'
import { Plus } from 'lucide-react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import AddLocationForm from '../forms/AddLocationForm';

const AddLocationDialog = () => {
  const [isOpen, setIsOpen] = useState<boolean>(false)
  
  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        <Button className='cursor-pointer'>
          <Plus className="h-4 w-4" />
          Add Location
        </Button>
      </DialogTrigger>

      <DialogContent>
        <DialogHeader>
          <DialogTitle>Add New Parking Location</DialogTitle>
          <DialogDescription>Enter the details for the new parking location.</DialogDescription>
        </DialogHeader>

        {/* Form */}
        <AddLocationForm setIsOpen={setIsOpen} />
      </DialogContent>

    </Dialog>
  )
}

export default AddLocationDialog