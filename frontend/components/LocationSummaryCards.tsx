import { getParkingSummary } from '@/lib/parking';
import React from 'react';
import { MapPin } from 'lucide-react';
import SummaryCard from './SummaryCard';

const LocationLocationSummaryCards = async () => {
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
    <div className='grid grid-cols-2 gap-4 md:grid-cols-4'>
      {summary.map((item, index) => (
        <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
      ))}
    </div>
  );
};

export default LocationLocationSummaryCards;
