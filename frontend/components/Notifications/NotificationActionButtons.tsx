'use client';

import { Notification } from '@/lib/types';
import React from 'react';
import { Button } from '../ui/button';
import { BookMarkedIcon, Check, Trash2 } from 'lucide-react';
import { deleteNotification, toggleNotificationReadStatus } from '@/lib/notification';
import { toast } from 'sonner';

const NotificationActionButtons = ({ notif }: { notif: Notification }) => {
  const [marking, setMarking] = React.useState<boolean>(false);
  const [deleting, setDeleting] = React.useState<boolean>(false);

  const handleToggleReadStatus = async () => {
    setMarking(true);
    const res = await toggleNotificationReadStatus(notif.id);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success(res.message);
    }
    setMarking(false);
  };

  const handleDeleteNotification = async () => {
    setDeleting(true);
    const res = await deleteNotification(notif.id);
    if (!res.success) {
      toast.error(res.message);
    } else {
      toast.success('Notification deleted successfully');
    }
    setDeleting(false);
  };

  return (
    <div className='flex items-center space-x-2'>
      {notif.is_read ? (
        <Button disabled={marking} onClick={() => handleToggleReadStatus()} variant='default' size='sm' className='text-xs cursor-pointer'>
          <BookMarkedIcon className='h-3 w-3 mr-1' />
          {marking ? 'Marking...' : 'Mark Unread'}
        </Button>
      ) : (
        <Button disabled={marking} onClick={() => handleToggleReadStatus()} variant='outline' size='sm' className='text-xs cursor-pointer'>
          <Check className='h-3 w-3 mr-1' />
          {marking ? 'Marking...' : 'Mark Read'}
        </Button>
      )}

      <Button disabled={deleting} onClick={() => handleDeleteNotification()} className='cursor-pointer' variant='destructive' size='sm'>
        {deleting ? (
          <div className='w-4 h-4'>
            <div className='animate-spin rounded-full h-3 w-3 border-t-2 border-blue-500'></div>
          </div>
        ) : (
          <Trash2 className='h-3 w-3' />
        )}
      </Button>
    </div>
  );
};

export default NotificationActionButtons;
