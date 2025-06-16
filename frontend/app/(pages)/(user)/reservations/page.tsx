import ReservationCard from '@/components/ReservationCard';
import SummaryCard from '@/components/SummaryCard';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getUserReservations } from '@/lib/user';
import { Calendar, Clock, DollarSign } from 'lucide-react';
import Link from 'next/link';
import React from 'react';

export const metadata = {
  title: 'My Reservations',
  description: 'View and manage your parking reservations.'
};

const UserReservation = async () => {
  const reservations = await getUserReservations();

  if (!reservations.success || !reservations.data) {
    return <div>Error: {reservations.message}</div>;
  }

  const summary = [
    {
      title: 'Active',
      value: reservations.data.active_reservation_count,
      icon: <Calendar className='h-4 w-4 text-green-500' />
    },
    {
      title: 'Upcoming',
      value: reservations.data.upcoming_reservation_count,
      icon: <Clock className='h-4 w-4 text-blue-500' />
    },
    {
      title: 'This Month',
      value: reservations.data.all_reservation_count,
      icon: <Calendar className='h-4 w-4 text-indigo-500' />
    },
    {
      title: 'Total Spent',
      value: `$${reservations.data.total_spent.toFixed(2)}`,
      icon: <DollarSign className='h-4 w-4 text-yellow-500' />
    }
  ];

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>My Reservations</h1>
        </div>
      </header>

      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Summary Card */}
        <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
          {summary.map((item, index) => (
            <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>

        {/* Reservation Tab */}
        <Tabs defaultValue='current' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='current'>
              Current ({reservations.data.active_reservation_count + reservations.data.upcoming_reservation_count})
            </TabsTrigger>
            <TabsTrigger value='history'>History ({reservations.data.past_reservation_count})</TabsTrigger>
          </TabsList>

          <TabsContent value='current'>
            {reservations.data.active_reservation_count === 0 && reservations.data.upcoming_reservation_count === 0 ? (
              <Card>
                <CardContent className='text-center py-12'>
                  <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>No Current Reservations</h3>
                  <p className='text-muted-foreground mb-4'>You don&apos;t have any active or upcoming parking reservations.</p>
                  <Link href='/locations'>
                    <Button>Find Parking</Button>
                  </Link>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {reservations.data.active_reservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
                {reservations.data.upcoming_reservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </TabsContent>

          <TabsContent value='history'>
            {reservations.data.past_reservation_count === 0 ? (
              <Card>
                <CardContent className='text-center py-12'>
                  <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
                  <h3 className='text-lg font-semibold mb-2'>No Past Reservations</h3>
                  <p className='text-muted-foreground mb-4'>You don&apos;t have any past parking reservations.</p>
                </CardContent>
              </Card>
            ) : (
              <div className='space-y-4'>
                {reservations.data.past_reservations.map((reservation) => (
                  <ReservationCard key={reservation.id} reservation={reservation} />
                ))}
              </div>
            )}
          </TabsContent>
        </Tabs>
      </div>
    </>
  );
};

export default UserReservation;
