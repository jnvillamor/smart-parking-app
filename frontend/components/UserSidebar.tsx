import { Calendar, Car, LayoutDashboard, MapPin, User } from 'lucide-react';
import {
  Sidebar,
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem
} from './ui/sidebar';
import React from 'react';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const UserSidebar = () => {
  const MENUITEM = [
    {
      title: 'Dashboard',
      url: '/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Find Parking',
      url: '/locations',
      icon: MapPin
    },
    {
      title: 'My Reservations',
      url: '/reservations',
      icon: Calendar
    },
    {
      title: 'Profile',
      url: '/profile',
      icon: User
    }
  ];

  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center space-x-2 px-2 py-2'>
          <Car className='h-8 w-8 text-blue-600' />
          <div>
            <h2 className='text-lg font-semibold'>SmartPark</h2>
            <p className='text-sm text-muted-foreground'>Welcome back!</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Navigation</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {MENUITEM.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <Link href={item.url}>
                      <item.icon />
                      <span>{item.title}</span>
                    </Link>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
       <SidebarFooter>
        <SidebarMenu>
          <SidebarMenuItem>
            <SidebarMenuButton asChild>
              <LogoutButton />
            </SidebarMenuButton>
          </SidebarMenuItem>
        </SidebarMenu>
      </SidebarFooter>
    </Sidebar>
  );
};

export default UserSidebar;
