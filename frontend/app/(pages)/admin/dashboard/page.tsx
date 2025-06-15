import DashboardSummary from '@/components/DashBoard/DashboardSummary';
import { SidebarTrigger } from '@/components/ui/sidebar';
import React from 'react';

const AdminDashboard = () => {
  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center gap-2'>
          <h1 className='text-xl font-semibold'>Admin Dashboard</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        {/* Summary Cards */}
        <DashboardSummary />

        
      </div>
    </>
  );
};

export default AdminDashboard;
