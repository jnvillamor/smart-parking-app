import React from 'react';

const UserDashboard = () => {
  return (
    <div className='p-4'>
      <h1 className='text-2xl font-semibold'>User Dashboard</h1>
      <p className='mt-2 text-muted-foreground'>
        Welcome to your dashboard! Here you can manage your reservations, view parking locations, and update your profile.
      </p>
      {/* Additional dashboard content can go here */}
    </div>
  );
};

export default UserDashboard;
