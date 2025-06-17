'use client';

import { UserProfile } from '@/lib/types';
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTrigger } from '../ui/dialog';
import { Button } from '../ui/button';
import { Ban, Calendar, CheckCircle, Eye, Mail } from 'lucide-react';
import { DialogDescription, DialogTitle } from '@radix-ui/react-dialog';
import { Label } from '../ui/label';
import {
  AlertDialog,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { getRoleColor, getStatusColor } from '@/lib/helper';
import { Badge } from '../ui/badge';
import { Input } from '../ui/input';
import { activateUser, deactivateUser } from '@/lib/user';
import FormattedDate from '../DateFormatter';

const UserActionButtons = ({ user }: { user: UserProfile }) => {
  const [isProcessing, setIsProcessing] = React.useState(false);
  const [isOpen, setIsOpen] = React.useState(false);
  const [reason, setReason] = React.useState('');

  const processStatus = async () => {
    setIsProcessing(true);
    let res;
    if (user.is_active) {
      res = await deactivateUser(user.id, reason);
    } else {
      res = await activateUser(user.id);
    }

    if (res.success) {
      toast.success(res.message);
    } else {
      toast.error(res.message);
    }
    setIsProcessing(false);
    setIsOpen(false);
  };

  return (
    <div className='flex space-x-2'>
      <Dialog>
        <DialogTrigger asChild>
          <Button variant='outline' size='sm' className='cursor-pointer'>
            <Eye className='h-4 w-4' />
          </Button>
        </DialogTrigger>
        <DialogContent className='max-w-2xl'>
          <DialogHeader>
            <DialogTitle className='font-medium'>User Details</DialogTitle>
            <DialogDescription className='text-sm text-muted-foreground'>Complete user information for {user.full_name}</DialogDescription>
          </DialogHeader>
          <div className='space-y-6'>
            <div className='flex items-center space-x-4'>
              <Avatar className='h-16 w-16'>
                <AvatarFallback className='text-lg'>{`${user.first_name.charAt(0)}${user.last_name.charAt(0)}`}</AvatarFallback>
              </Avatar>
              <div>
                <h3 className='text-lg font-semibold'>{user.full_name}</h3>
                <p className='text-muted-foreground'>User ID: #{user.id}</p>
                <div className='flex space-x-2 mt-2'>
                  <Badge className={getRoleColor(user.role)}>{user.role.charAt(0).toUpperCase() + user.role.slice(1)}</Badge>
                  <Badge className={getStatusColor(user.is_active)}>{user.is_active ? 'Active' : 'Inactive'}</Badge>
                </div>
              </div>
            </div>

            <div className='grid grid-cols-2 gap-6'>
              <div>
                <Label className='text-sm font-medium'>Contact Information</Label>
                <div className='mt-2 space-y-2'>
                  <p className='flex items-center text-sm'>
                    <Mail className='h-4 w-4 mr-2' />
                    {user.email}
                  </p>
                </div>
              </div>
              <div>
                <Label className='text-sm font-medium'>Account Activity</Label>
                <div className='mt-2 space-y-2'>
                  <p className='flex items-center text-sm'>
                    <Calendar className='h-4 w-4 mr-2' />
                    Joined: {<FormattedDate isoDate={user.created_at} />}
                  </p>
                  <p className='flex items-center text-sm text-muted-foreground'>Last Login: {<FormattedDate isoDate={user.last_login} />}</p>
                  <p className='flex items-center text-sm text-muted-foreground'>Last Seen: {<FormattedDate isoDate={user.last_seen} />}</p>
                </div>
              </div>
            </div>
          </div>
        </DialogContent>
      </Dialog>
      {user.role !== 'admin' && (
        <AlertDialog open={isOpen} onOpenChange={setIsOpen}>
          <AlertDialogTrigger asChild>
            <Button className='cursor-pointer' variant={user.is_active ? 'destructive' : 'default'} size='sm'>
              {user.is_active ? <Ban className='h-4 w-4' /> : <CheckCircle className='h-4 w-4' />}
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>{user.is_active ? 'Deactivate' : 'Activate'} User Account</AlertDialogTitle>
              <AlertDialogDescription>
                Are you sure you want to {user.is_active ? 'deactivate' : 'activate'} {user.full_name}&apos;s account?
                {user.is_active && ' This will prevent them from logging in and making new reservations.'}
              </AlertDialogDescription>
            </AlertDialogHeader>
            {user.is_active && (
              <div className='space-y-2'>
                <Label htmlFor='reason'>Deactivation Reason (Optional)</Label>
                <Input id='reason' onChange={(e) => setReason(e.target.value)} placeholder='Enter reason for deactivation...' />
              </div>
            )}
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <Button className='cursor-pointer' variant={user.is_active ? 'destructive' : 'default'} onClick={() => processStatus()}>
                {isProcessing ? 'Processing...' : user.is_active ? 'Deactivate User' : 'Activate User'}
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      )}
    </div>
  );
};

export default UserActionButtons;
