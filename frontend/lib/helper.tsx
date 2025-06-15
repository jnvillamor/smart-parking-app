import { Badge } from '@/components/ui/badge';

export const getStatusBadge = (status: string) => {
  switch (status) {
    case 'Active':
      return <Badge className='bg-green-100 text-green-800'>Active</Badge>;
    case 'Upcoming':
      return <Badge className='bg-blue-100 text-blue-800'>Upcoming</Badge>;
    case 'Completed':
      return <Badge className='bg-gray-100 text-gray-800'>Completed</Badge>;
    case 'Cancelled':
      return <Badge className='bg-red-100 text-red-800'>Cancelled</Badge>;
    default:
      return <Badge className='bg-yellow-100 text-yellow-800'>Unknown</Badge>;
  }
};
