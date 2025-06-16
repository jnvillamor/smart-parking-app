import { SidebarInset, SidebarProvider } from '@/components/ui/sidebar';
import UserSidebar from '@/components/UserSidebar';
import { getAllNotifications } from '@/lib/notification';
import React, { ReactNode } from 'react';

const layout = async ({ children }: { children: ReactNode }) => {
  const notifications = await getAllNotifications();

  return (
    <SidebarProvider>
      <UserSidebar unread_notifs = {notifications.data?.unread_notifications_count}/>
      <SidebarInset>{children}</SidebarInset>
    </SidebarProvider>
  );
};

export default layout;
