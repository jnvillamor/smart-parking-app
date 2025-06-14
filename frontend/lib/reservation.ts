'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { ReservationSummary } from './types';

export const getReservationSummary = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'User not authenticated'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/reservations/summary`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.message || 'Failed to fetch reservation summary'
      };
    }

    const data = await res.json() as ReservationSummary;
    return {
      success: true,
      message: 'Reservation summary fetched successfully',
      data: data
    };
  } catch (error) {
    console.error('Error fetching reservation summary:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};
