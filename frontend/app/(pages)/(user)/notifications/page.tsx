import MarkAllReadButton from '@/components/Notifications/MarkAllReadButton';
import NotificationCard from '@/components/Notifications/NotificationCard';
import SummaryCard from '@/components/SummaryCard';
import { Badge } from '@/components/ui/badge';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getAllNotifications } from '@/lib/notification';
import { Bell, BellRing, Check } from 'lucide-react';
import React from 'react';

const NotificationPage = async () => {
  const notifsData = await getAllNotifications();

  if (!notifsData.success || !notifsData.data) {
    return <div className='text-red-500'>{notifsData.message}</div>;
  }

  const data = notifsData.data;

  const summary = [
    {
      title: 'Total Notifications',
      value: data.all_notifications_count || 0,
      icon: <Bell className='h-4 w-4 text-muted-foreground' />
    },
    {
      title: 'Unread Notifications',
      value: data.unread_notifications_count || 0,
      icon: <BellRing className='h-4 w-4 text-orange-500' />
    },
    {
      title: 'Read Notifications',
      value: data.read_notifications_count || 0,
      icon: <Check className='h-4 w-4 text-green-500' />
    }
  ];

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <div className='flex items-center space-x-3'>
            <h1 className='text-xl font-semibold'>Notifications</h1>
            {data.unread_notifications_count > 0 && (
              <Badge variant='destructive' className='text-xs'>
                {data.unread_notifications_count} unread
              </Badge>
            )}
          </div>
          {data.unread_notifications_count > 0 && (
            <MarkAllReadButton />
          )}
        </div>
      </header>

      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='grid grid-cols-2 md:grid-cols-3 gap-4'>
          {summary.map((item, index) => (
            <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>

        <Tabs defaultValue='all' className='space-y-4'>
          <TabsList>
            <TabsTrigger className='cursor-pointer' value='all'>
              All
            </TabsTrigger>
            <TabsTrigger className='cursor-pointer' value='unread'>
              Unread
            </TabsTrigger>
            <TabsTrigger className='cursor-pointer' value='read'>
              Read
            </TabsTrigger>
          </TabsList>

          <TabsContent value='all'>
            <div className='space-y-4'>
              {data.read_notifications_count === 0 && data.unread_notifications_count === 0 && (
                <div className='text-center py-12'>
                  <Bell className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>You don&apos;t have any notifications.</h3>
                </div>
              )}
              {data.unread_notifications_count > 0 && data.unread_notifications.map((notif) => <NotificationCard key={notif.id} notif={notif} />)}
              {data.read_notifications_count > 0 && data.read_notifications.map((notif) => <NotificationCard key={notif.id} notif={notif} />)}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default NotificationPage;
