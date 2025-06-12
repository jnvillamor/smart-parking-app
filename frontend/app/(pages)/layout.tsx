import dynamic from "next/dynamic";

const SidebarProvider = dynamic(() => import("@/components/ui/sidebar").then(mod => mod.SidebarProvider))

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <SidebarProvider>
      {children}
    </SidebarProvider>
  );
}
