import { SidebarProvider } from "@/components/ui/sidebar";
import UserSidebar from "@/components/UserSidebar";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      <UserSidebar />
      {children}
    </SidebarProvider>
  );
}
