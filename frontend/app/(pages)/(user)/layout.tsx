import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import UserSidebar from '@/components/UserSidebar';
import React, { ReactNode } from 'react';

const layout = ({ children }: { children: ReactNode }) => {
  return (
    <SidebarProvider>
      <UserSidebar />
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
