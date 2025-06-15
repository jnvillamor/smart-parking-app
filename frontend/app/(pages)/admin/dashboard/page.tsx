import SummaryCard from '@/components/SummaryCard';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getSummaryData } from '@/lib/admin';
import { getStatusBadge } from '@/lib/helper';
import { getReservations } from '@/lib/reservation';
import { BadgeDollarSign, Calendar, DollarSign, MapPin, Users } from 'lucide-react';
import React from 'react';

const AdminDashboard = async () => {
  const summary = await getSummaryData();
  const recent_reservations = await getReservations({ sort: 'time', order: 'desc' });

  if (!summary.success) {
    return <div className='text-red-500'>{summary.message}</div>;
  }

  const calculateTimeDifference = (createdAt: string) => {
    const now = new Date();
    const createdDate = new Date(createdAt);
    const diffInSeconds = Math.floor((now.getTime() - createdDate.getTime()) / 1000);

    if (diffInSeconds < 60) {
      return `${diffInSeconds} seconds ago`;
    } else if (diffInSeconds < 3600) {
      return `${Math.floor(diffInSeconds / 60)} minutes ago`;
    } else if (diffInSeconds < 86400) {
      return `${Math.floor(diffInSeconds / 3600)} hours ago`;
    } else {
      return `${Math.floor(diffInSeconds / 86400)} days ago`;
    }
  }

  const card_summary = [
    {
      title: 'Total Users',
      value: summary.data?.total_users || 0,
      icon: <Users className='h-4 w-4 text-muted-foreground' />
    },
    {
      title: 'Active Location',
      value: summary.data?.total_active_parking || 0,
      icon: <MapPin className='h-4 w-4 text-green-500' />
    },
    {
      title: 'Total Reservations',
      value: summary.data?.total_reservations || 0,
      icon: <Calendar className='h-4 w-4 text-blue-500' />
    },
    {
      title: 'Total Revenue',
      value: `$${summary.data?.total_revenue.toFixed(2)}` || '$0.00',
      icon: <BadgeDollarSign className='h-4 w-4 text-yellow-500' />
    }
  ];

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold'>Admin Dashboard</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {card_summary.map((item, index) => (
            <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>
        <div className='grid gap-4 grid-cols-2 md:grid-cols-4 lg:grid-cols-7'>
          <Card className='md:grid-cols-2 lg:col-span-4'>
            <CardHeader>
              <CardTitle className='text-2xl font-medium'>Recent Reservations</CardTitle>
              <CardDescription>Latest parking reservations made by users</CardDescription>
            </CardHeader>
            <CardContent>
              <div className='space-y-4'>
                {recent_reservations.data &&
                  recent_reservations.data?.reservations.length > 0 &&
                  recent_reservations.data.reservations.slice(0, 5).map((reservation) => (
                    <div key={reservation.id} className='flex items-center justify-between p-3 border rounded-lg'>
                      <div>
                        <p className='font-medium'>{reservation.user.full_name}</p>
                        <p className='text-muted-foreground'>{reservation.parking.name}</p>
                      </div>
                      <div className='text-right'>
                        <p className='text-sm'>{calculateTimeDifference(reservation.created_at)}</p>
                        <span>{getStatusBadge(reservation.status)}</span>
                      </div>
                    </div>
                  ))}
              </div>
            </CardContent>
          </Card>
          <Card className='md:grid-cols-2 lg:col-span-3'>
            <CardHeader>
              <CardTitle className='text-2xl font-medium'>Quick Stats</CardTitle>
              <CardDescription>Key metrics at a glance</CardDescription>
            </CardHeader>
            <CardContent className='space-y-4'>
              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <MapPin className='h-4 w-4 text-muted-foreground' />
                  <span className='text-sm'>New Parking Lots Today</span>
                </div>
                <span className='font-medium'>{summary.data?.new_parking_lots_today}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Calendar className='h-4 w-4 text-green-500' />
                  <span className='text-sm'>New Reservation Today</span>
                </div>
                <span className='font-medium'>{summary.data?.new_reservations_today}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <DollarSign className='h-4 w-4 text-yellow-500' />
                  <span className='text-sm'>Revenue Today</span>
                </div>
                <span className='font-medium'>${summary.data?.new_revenue_today.toFixed(2)}</span>
              </div>

              <div className="flex items-center justify-between">
                <div className="flex items-center space-x-2">
                  <Users className='h-4 w-4 text-violet-500-500' />
                  <span className='text-sm'>New Users Today</span>
                </div>
                <span className='font-medium'>{summary.data?.new_users_today}</span>
              </div>

            </CardContent>
          </Card>
        </div>
      </div>
    </>
  );
};

export default AdminDashboard;
