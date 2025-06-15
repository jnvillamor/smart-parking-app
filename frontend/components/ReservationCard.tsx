import React from 'react';
import { getStatusBadge } from '@/lib/helper';
import { MapPin } from 'lucide-react';
import { Reservation } from '@/lib/types';
import ReservationCardActionButtons from './ReservationCardActionButtons';

const ReservationCard = ({ reservation }: { reservation: Reservation }) => {
  return (
    <div key={reservation.id} className='border rounded-lg p-4'>
      <div className='flex items-start justify-between mb-2'>
        <div>
          <h3 className='font-semibold'>{reservation.parking.name}</h3>
          <p className='text-sm text-muted-foreground flex items-center'>
            <MapPin className='h-3 w-3 mr-1' />
            {reservation.parking.location}
          </p>
        </div>
      </div>
      <div className='grid grid-cols-2 gap-4 text-sm'>
        <div>
          <p className='text-muted-foreground'>Status</p>
          {getStatusBadge(reservation.status)}
        </div>
        <div>
          <p className='text-muted-foreground'>Cost</p>
          <p className='font-medium'>${reservation.total_cost.toFixed(2)}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>Start</p>
          <p className='font-medium'>{new Date(reservation.start_time).toLocaleString()}</p>
        </div>
        <div>
          <p className='text-muted-foreground'>End</p>
          <p className='font-medium'>{new Date(reservation.end_time).toLocaleString()}</p>
        </div>
      </div>
      <ReservationCardActionButtons reservation={reservation} />
    </div>
  );
};

export default ReservationCard;
