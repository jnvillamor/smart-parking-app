'use client';

import React from 'react';
import { Button } from '../ui/button';
import { CheckCheck } from 'lucide-react';
import { markAllNotificationsAsRead } from '@/lib/notification';
import { toast } from 'sonner';

const MarkAllReadButton = () => {
  const [marking, setMarking] = React.useState(false);

  const handleMarkAllRead = async () => {
    setMarking(true);
    const res = await markAllNotificationsAsRead();
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success('All notifications marked as read successfully');
    }
    setMarking(false);
  };
  return (
    <Button disabled={marking} onClick={() => handleMarkAllRead()} className='cursor-pointer' variant='outline'>
      <CheckCheck className='h-4 w-4 mr-2' />
      {marking ? 'Marking...' : 'Mark All Read'}
    </Button>
  );
};

export default MarkAllReadButton;
