import { Notification } from '@/lib/types';
import React from 'react';
import { Card, CardContent } from '../ui/card';
import { Bell } from 'lucide-react';
import { calculateTimeDifference } from '@/lib/helper';
import NotificationActionButtons from './NotificationActionButtons';

const NotificationCard = ({ notif }: { notif: Notification }) => {
  return (
    <Card className={`transition-all duration-200 ${!notif.is_read && 'bg-muted shadow-sm'}`}>
      <CardContent className='space-y-4'>
        <div className='flex items-start space-x-4'>
          <div className='flex-shrink-0 mt-1'>
            <Bell className={`h-5 w-5 ${notif.is_read && 'text-foreground'} ${!notif.is_read ? 'text-orange-500' : ''}`} />
          </div>

          <div className='flex-1 min-w-0'>
            <div className='flex items-start justify-between mb-2'>
              <p className={`text-sm mb-3 ${notif.is_read ? 'text-muted-foreground' : 'text-foreground'}`}>{notif.message}</p>
              <div className='flex items-center space-x-2'>{!notif.is_read && <div className='w-2 h-2 bg-blue-600 rounded-full'></div>}</div>
            </div>

            <div className='flex items-center justify-between'>
              <span className='text-xs text-muted-foreground'>{calculateTimeDifference(notif.created_at)}</span>
              <NotificationActionButtons notif={notif} />
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default NotificationCard;
