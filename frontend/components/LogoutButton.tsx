'use client';

import React from 'react';
import { Button } from './ui/button';
import { signOut } from 'next-auth/react';
import { LogOut } from 'lucide-react';

const LogoutButton = () => {
  return (
    <Button
      onClick={() =>
        signOut({
          callbackUrl: '/auth/login'
        })
      }
      variant='ghost'
      className='flex items-center space-x-2'>
      <LogOut />
      <span>Logout</span>
    </Button>
  );
};

export default LogoutButton;
