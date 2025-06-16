import AdminSidebar from '@/components/AdminSidebar';
import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import React, { ReactNode } from 'react';

export const metadata = {
  title: {
    default: 'Admin Dashboard',
    template: '%s | Admin SmartPark'
  },
  description: 'Manage your SmartPark system with ease.'
};

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <AdminSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
