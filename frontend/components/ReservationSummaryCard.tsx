import { getReservationSummary } from '@/lib/reservation';
import { Calendar, CheckCircle2, Clock } from 'lucide-react';
import React from 'react';
import SummaryCard from './SummaryCard';

const ReservationSummaryCard = async () => {
  const reservations = await getReservationSummary();

  if (!reservations.success) {
    return <div>Error: {reservations.message}</div>;
  }

  const summary = [
    {
      title: 'Total Reservation',
      value: reservations.data?.total_reservations || 0,
      icon: <Calendar className='h-4 w-4 text-muted-foreground' />
    },
    {
      title: 'Total Active Reservation',
      value: reservations.data?.total_active_reservations || 0,
      icon: <Calendar className='h-4 w-4 text-green-500' />
    },
    {
      title: 'Total Upcoming Reservation',
      value: reservations.data?.total_upcoming_reservations || 0,
      icon: <Clock className='h-4 w-4 text-blue-500' />
    },
    {
      title: 'Total Completed Reservation',
      value: reservations.data?.total_completed_reservations || 0,
      icon: <CheckCircle2 className='h-4 w-4 text-green-500' />
    }
  ];

  return (
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {summary.map((item, index) => (
        <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
      ))}
    </div>
  );
};

export default ReservationSummaryCard;
