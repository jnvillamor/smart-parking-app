'use client';

import React from 'react';
import { Badge } from '../ui/badge';
import { toggleParkingLocationStatus } from '@/lib/parking';
import { toast } from 'sonner';
import { ParkingLocation } from '@/lib/types';

const LocationTableStatusButton = ({ loc }: { loc: ParkingLocation }) => {
  const handleToggle = async () => {
    const res = await toggleParkingLocationStatus(loc.id);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(`Location status updated to ${!loc.is_active ? 'Active' : 'Inactive'}`);
    }
  };
  return (
    <Badge className='cursor-pointer' onClick={() => handleToggle()} variant={loc.is_active ? 'default' : 'secondary'}>
      {loc.is_active ? 'Active' : 'Inactive'}
    </Badge>
  );
};

export default LocationTableStatusButton;
