import { getReservations } from '@/lib/reservation';
import { SearchParams } from 'next/dist/server/request/search-params';
import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { Badge } from '../ui/badge';
import Pagination from '../Pagination';
import ReservationActionButtons from './ReservationActionButtons';
import SortingButton from './SortingButton';
import { Calendar } from 'lucide-react';

const ReservationTable = async ({ params }: { params: SearchParams }) => {
  const reservations = await getReservations(params);

  if (!reservations.success || !reservations.data) {
    return <div>Error: {reservations.message}</div>;
  }

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Active':
        return <Badge className='bg-green-100 text-green-800'>Active</Badge>;
      case 'Upcoming':
        return <Badge className='bg-blue-100 text-blue-800'>Upcoming</Badge>;
      case 'Completed':
        return <Badge className='bg-gray-100 text-gray-800'>Completed</Badge>;
      case 'Cancelled':
        return <Badge className='bg-red-100 text-red-800'>Cancelled</Badge>;
      default:
        return <Badge className='bg-yellow-100 text-yellow-800'>Unknown</Badge>;
    }
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>All Reservations ({reservations.data?.reservations.length || 0})</CardTitle>
        <CardDescription>Manage user reservations and handle cancellations</CardDescription>
      </CardHeader>
      <CardContent>
        <Table>
          {/* Header */}
          <TableHeader>
            <TableRow>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>
                <SortingButton title='id' />
              </TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>
                <SortingButton title='user' />
              </TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>
                <SortingButton title='parking' />
              </TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>
                <SortingButton title='time' />
              </TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Duration</TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Cost</TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>
                <SortingButton title='status' />
              </TableHead>
              <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Actions</TableHead>
            </TableRow>
          </TableHeader>

          {/* Content */}
          <TableBody>
            {reservations.data.reservations.map((reservation) => (
              <TableRow key={reservation.id}>
                <TableCell className='p-4 align-middle font-medium'>#{reservation.id}</TableCell>
                <TableCell className='p-4 align-middle'>
                  <p>{reservation.user.full_name}</p>
                  <p className='text-muted-foreground'>{reservation.user.email}</p>
                </TableCell>
                <TableCell className='p-4 align-middle'>
                  <p>{reservation.parking.name}</p>
                  <p className='text-muted-foreground'>{reservation.parking.location}</p>
                </TableCell>
                <TableCell className='p-4 align-middle'>
                  <div className='text-sm'>
                    <p>{new Date(reservation.start_time).toLocaleString()}</p>
                    <p className='text-muted-foreground'>to {new Date(reservation.end_time).toLocaleString()}</p>
                  </div>
                </TableCell>
                <TableCell className='p-4 align-middle'>{reservation.duration_hours.toFixed(2)}h</TableCell>
                <TableCell className='p-4 align-middle'>${reservation.total_cost.toFixed(2)}</TableCell>
                <TableCell className='p-4 align-middle'>{getStatusBadge(reservation.status)}</TableCell>
                <TableCell className='p-4 align-middle'>
                  <ReservationActionButtons reservation={reservation} />
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>

        {/* Pagination */}
        {reservations.data.reservations.length > 0 && <Pagination type='reservations' data={reservations.data} />}

        {/* No Reservations Found */}
        {reservations.data.reservations.length === 0 && (
          <div className='text-center py-12'>
            <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No reservations found</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default ReservationTable;
