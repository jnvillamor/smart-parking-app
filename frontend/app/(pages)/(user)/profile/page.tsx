import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import ProfileForm from '@/components/ProfileForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { SidebarInset, SidebarTrigger } from '@/components/ui/sidebar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import UpdatePasswordForm from '@/components/UpdatePasswordForm';
import { getServerSession } from 'next-auth';
import React from 'react';

const Profile = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return (
      <div className='flex items-center justify-center h-full'>
        <p className='text-lg text-muted-foreground'>You must be logged in to view this page.</p>
      </div>
    );
  }

  return (
    <SidebarInset>
      {/* Header */}
      <header className='flex h-16 shrink-0 items-center gap-2 border-b px-4'>
        <SidebarTrigger className='-ml-1' />
        <div className='flex items-center justify-between w-full'>
          <h1 className='text-xl font-semibold'>Profile Settings</h1>
        </div>
      </header>

      {/* Content */}
      <div className='flex-1 space-y-4 p-4 md:p-8 pt-6'>
        <Tabs defaultValue='profile' className='space-y-4'>
          <TabsList>
            <TabsTrigger value='profile'>Profile</TabsTrigger>
            <TabsTrigger value='security'>Security</TabsTrigger>
          </TabsList>

          {/* Profile Information */}
          <TabsContent value='profile'>
            <Card>
              <CardHeader>
                <CardTitle className='text-2xl font-bold'>Profile Information</CardTitle>
                <CardDescription>Update your personal information and contact details</CardDescription>
              </CardHeader>
              <CardContent>
                <ProfileForm session={session} />
              </CardContent>
            </Card>
          </TabsContent>

          {/* Security Information */}
          <TabsContent value='security'>
            <Card>
              <CardHeader className='prose'>
                <CardTitle className='text-2xl font-bold'>Security Settings</CardTitle>
                <CardDescription>Update your password to keep your account secure</CardDescription>
              </CardHeader>
              <CardContent>
                 <UpdatePasswordForm />
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </SidebarInset>
  );
};

export default Profile;
