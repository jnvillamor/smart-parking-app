import SummaryCard from '@/components/SummaryCard';
import { SidebarTrigger } from '@/components/ui/sidebar';
import UserFilters from '@/components/UserPage/UserFilters';
import UserTable from '@/components/UserPage/UserTable';
import { getUserSummary } from '@/lib/user';
import { Crown, UserCheck2, Users, UserX2 } from 'lucide-react';
import { SearchParams } from 'next/dist/server/request/search-params';
import React from 'react';

export const metadata = {
  title: 'Users',
  description: 'Manage and view all users in the system.',
};

const AdminUsersTab = async ({ searchParams }: { searchParams: Promise<SearchParams> }) => {
  const params = await searchParams;
  console.log('Admin Users Tab Params:', params);
  const summary = await getUserSummary();
  if (!summary.success) {
    return <div className='text-red-500'>{summary.message}</div>;
  }
  const userSummary = [
    {
      title: 'Total Users',
      value: summary.data?.total_users || 0,
      icon: <Users className='h-4 w-4 text-violet-500' />
    },
    {
      title: 'Active Users',
      value: summary.data?.active_users || 0,
      icon: <UserCheck2 className='h-4 w-4 text-green-500' />
    },
    {
      title: 'Inactive Users',
      value: summary.data?.inactive_users || 0,
      icon: <UserX2 className='h-4 w-4 text-red-500' />
    },
    {
      title: 'Admins',
      value: summary.data?.admin_users || 0,
      icon: <Crown className='h-4 w-4 text-yellow-500' />
    }
  ];

  return (
    <>
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>User Management</h1>
        </div>
      </header>
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <div className='grid gap-4 grid-cols-2 md:grid-cols-4'>
          {userSummary.map((item, index) => (
            <SummaryCard key={index} title={item.title} value={item.value} icon={item.icon} />
          ))}
        </div>
        {/* Filters */}
        <UserFilters />

        {/* User Table */}
        <UserTable params={params} />
      </div>
    </>
  );
};

export default AdminUsersTab;
