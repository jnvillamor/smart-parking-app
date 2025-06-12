import UserSidebar from "@/components/UserSidebar";

export default function Layout({
  children
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <>
      <UserSidebar />
      {children}
    </>
  );
}
