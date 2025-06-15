import SummaryCard from '@/components/SummaryCard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { getSummaryData } from '@/lib/admin';
import { BadgeDollarSign, Calendar, MapPin, Users } from 'lucide-react';
import React from 'react';

const AdminDashboard = async () => {
  const summary = await getSummaryData();
  if (!summary.success) {
    return <div className='text-red-500'>{summary.message}</div>;
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
      </div>
    </>
  );
};

export default AdminDashboard;
