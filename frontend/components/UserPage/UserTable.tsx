import React from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../ui/table';
import { getPaginatedUsers } from '@/lib/user';
import { SearchParams } from 'next/dist/server/request/search-params';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Calendar, Mail } from 'lucide-react';
import { Badge } from '../ui/badge';
import Pagination from '../Pagination';
import { getRoleColor, getStatusColor } from '@/lib/helper';
import UserActionButtons from './UserActionButtons';
import FormattedDate from '../DateFormatter';

const UserTable = async ({ params }: { params: SearchParams }) => {
  const users = await getPaginatedUsers(params);

  if (!users.success || !users.data) {
    return <div>Error: {users.message}</div>;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className='text-lg font-semibold'>All Users ({users.data?.users.length || 0})</CardTitle>
        <CardDescription>Manage user accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <div className='overflow-x-auto'>
          <Table>
            {/* Header */}
            <TableHeader>
              <TableRow>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>User</TableHead>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Contact</TableHead>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Role</TableHead>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Status</TableHead>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Activity</TableHead>
                <TableHead className='h-12 px-4 text-lef align-middle font-medium text-muted-foreground'>Action</TableHead>
              </TableRow>
            </TableHeader>

            {/* Content */}
            <TableBody>
              {users.data.users.map((user) => (
                <TableRow key={user.id}>
                  <TableCell className='p-4 align-middle font-medium'>
                    <div className='flex items-center space-x-3'>
                      <Avatar>
                        <AvatarFallback>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className='font-medium'>{user.full_name}</p>
                        <p className='text-sm text-muted-foreground'>ID: #{user.id}</p>
                      </div>
                    </div>
                  </TableCell>
                  <TableCell className='p-4 align-middle'>
                    <p className='flex items-center text-sm'>
                      <Mail className='h-3 w-3 mr-2' />
                      {user.email}
                    </p>
                  </TableCell>
                  <TableCell className='p-4 align-middle'>
                    <Badge className={getRoleColor(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                  </TableCell>
                  <TableCell className='p-4 align-middle'>
                    <Badge className={getStatusColor(user.is_active)}>{user.is_active ? 'Active' : 'Inactive'}</Badge>
                  </TableCell>
                  <TableCell className='p-4 align-middle'>
                    <div className='mt-2 space-y-2'>
                      <p className='flex items-center text-sm'>
                        <Calendar className='h-4 w-4 mr-2' />
                        Joined: {<FormattedDate isoDate={user.created_at} />}
                      </p>
                      <p className='flex items-center text-sm text-muted-foreground'>Last Login: {<FormattedDate isoDate={user.last_login} />}</p>
                      <p className='flex items-center text-sm text-muted-foreground'>Last Seen: {<FormattedDate isoDate={user.last_seen} />}</p>
                    </div>
                  </TableCell>
                  <TableCell className='p-4 align-middle'>
                    <UserActionButtons user={user} />
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>

        {/* Pagination */}
        {users.data.users.length > 0 && <Pagination type='users' data={users.data} />}

        {/* No users Found */}
        {users.data.users.length === 0 && (
          <div className='text-center py-12'>
            <Calendar className='h-12 w-12 text-muted-foreground mx-auto mb-4' />
            <h3 className='text-lg font-semibold mb-2'>No users found</h3>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default UserTable;
