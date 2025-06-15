import ReservationCard from '@/components/ReservationCard';
import SummaryCard from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getUserDashboardData } from '@/lib/user';
import { Calendar, Car, Clock, MapPin, Plus } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

const UserDashboard = async () => {
  const res = await getUserDashboardData();
  if (!res.success || !res.data) {
    return <div>Error: {res.message}</div>;
  }
  const data = res.data;

  const summary = [
    {
      title: 'Active Reservations',
      value: `${data.all_active_reservations + data.all_upcoming_reservations}`,
      icon: <Car className='h-4 w-4 text-muted-foreground' />,
      subTitle: `${data.all_active_reservations} Active, ${data.all_upcoming_reservations} Upcoming`
    },
    {
      title: 'These month',
      value: data.all_reservation_current_month,
      icon: <Calendar className='h-4 w-4 text-muted-foreground' />,
      subTitle: 'Total Reservations'
    },
    {
      title: 'Total Spent',
      value: `$${data.total_spent_current_month.toFixed(2)}`,
      icon: <Calendar className='h-4 w-4 text-muted-foreground' />,
      subTitle: 'This Month'
    },
    {
      title: 'Avg. Duration',
      value: `${data.ave_duration_per_reservation}h`,
      icon: <Clock className='h-4 w-4 text-muted-foreground' />,
      subTitle: 'Per Reservation'
    }
  ];

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>Dashboard</h1>
          <Link href='/locations'>
            <Button className='cursor-pointer'>
              <Plus className='h-4 w-4' />
              New Reservation
            </Button>
          </Link>
        </div>
      </header>

      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Quick Stats */}
        <div className='grid grid-cols-2 md:grid-cols-4 gap-4'>
          {summary.map((item, index) => (
            <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} subTitle={item.subTitle} />
          ))}
        </div>

        {/* Recent Reservations */}
        <Card>
          <CardHeader>
            <CardTitle>Current Reservations</CardTitle>
            <CardDescription>Your active and upcoming parking reservations</CardDescription>
          </CardHeader>
          <CardContent>
            <div className='space-y-4'>
              {data.recent_reservations.map((reservation) => (
                <ReservationCard key={reservation.id} reservation={reservation} />
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Quick Links */}
        <Card>
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
              <CardDescription>Common tasks you might want to perform</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="grid gap-4 md:grid-cols-3">
                <Link href="/locations">
                  <Button variant="outline" className="w-full h-20 flex flex-col cursor-pointer">
                    <MapPin className="h-6 w-6 mb-2" />
                    Find Parking
                  </Button>
                </Link>
                <Link href="/reservations">
                  <Button variant="outline" className="w-full h-20 flex flex-col cursor-pointer">
                    <Calendar className="h-6 w-6 mb-2" />
                    My Reservations
                  </Button>
                </Link>
                <Link href="/profile">
                  <Button variant="outline" className="w-full h-20 flex flex-col cursor-pointer">
                    <Car className="h-6 w-6 mb-2" />
                    Profile Settings
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
      </div>
    </>
  );
};

export default UserDashboard;
