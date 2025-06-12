import { Calendar, Car, LayoutDashboard, MapPin, Settings, Sidebar, Users } from 'lucide-react';
import React from 'react';
import { SidebarContent, SidebarFooter, SidebarGroup, SidebarGroupContent, SidebarGroupLabel, SidebarHeader, SidebarMenu, SidebarMenuButton, SidebarMenuItem } from './ui/sidebar';
import Link from 'next/link';
import LogoutButton from './LogoutButton';

const AdminSidebar = () => {
  const menuItems = [
    {
      title: 'Dashboard',
      url: '/admin/dashboard',
      icon: LayoutDashboard
    },
    {
      title: 'Locations',
      url: '/admin/locations',
      icon: MapPin
    },
    {
      title: 'Reservations',
      url: '/admin/reservations',
      icon: Calendar
    },
    {
      title: 'Users',
      url: '/admin/users',
      icon: Users
    },
    {
      title: 'Settings',
      url: '/admin/settings',
      icon: Settings
    }
  ];
  return (
    <Sidebar>
      <SidebarHeader>
        <div className='flex items-center space-x-2 px-2 py-2'>
          <Car className='h-8 w-8 text-blue-600' />
          <div>
            <h2 className='text-lg font-semibold'>SmartPark</h2>
            <p className='text-sm text-muted-foreground'>Admin Panel</p>
          </div>
        </div>
      </SidebarHeader>
      <SidebarContent>
        <SidebarGroup>
          <SidebarGroupLabel>Management</SidebarGroupLabel>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
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

export default AdminSidebar;
