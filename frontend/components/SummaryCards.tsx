import { getParkingSummary } from '@/lib/parking';
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { MapPin } from 'lucide-react';

const SummaryCards = async () => {
  const summaryData = await getParkingSummary();

  if (!summaryData.success) {
    return <div className='text-red-500'>{summaryData.message}</div>;
  }

  const summary = [
    {
      title: 'Total Locations',
      value: summaryData.data?.total_parking_lots || 0,
      icon: <MapPin className='h-4 w-4 text-muted-foreground' />
    },
    {
      title: 'Active Locations',
      value: summaryData.data?.total_active_parking_lots || 0,
      icon: <MapPin className='h-4 w-4 text-green-500' />
    },
    {
      title: 'Available Slots',
      value: summaryData.data?.total_available_slots || 0,
      icon: <MapPin className='h-4 w-4 text-blue-500' />
    },
    {
      title: 'Reserved Slots',
      value: summaryData.data?.total_reserved_slots || 0,
      icon: <MapPin className='h-4 w-4 text-yellow-500' />
    }
  ];

  return (
    <div className='grid gap-4 md:grid-cols-4'>
      {summary.map((item, index) => (
        <Card key={index}>
          <CardHeader className='flex items-center justify-between space-y-0 pb-2'>
            <CardTitle className='text-sm font-medium'>{item.title}</CardTitle>
            {item.icon}
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{item.value}</div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
};

export default SummaryCards;
