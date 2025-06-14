'use server';

import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { getServerSession } from 'next-auth';
import { PaginatedReservations, ReservationSummary } from './types';
import { SearchParams } from 'next/dist/server/request/search-params';
import { revalidatePath } from 'next/cache';

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
        message: errorData.detail || 'Failed to fetch reservation summary'
      };
    }

    const data = (await res.json()) as ReservationSummary;
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

export const getReservations = async (params: SearchParams) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      success: false,
      message: 'User not authenticated'
    };
  }

  try {
    const entries: [string, string][] = [];

    Object.entries(params).forEach(([key, value]) => {
      if (typeof value === 'string') {
        entries.push([key, value]);
      } else if (Array.isArray(value)) {
        value.forEach((v) => entries.push([key, v]));
      }
    });
    const queryString = new URLSearchParams(entries);

    const res = await fetch(`${process.env.API_BASE_URL}/reservations?${queryString.toString()}`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch reservations'
      };
    }

    const data = (await res.json()) as PaginatedReservations;
    return {
      success: true,
      message: 'Reservations fetched successfully',
      data: data
    };
  } catch (error) {
    console.error('Error fetching reservations:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
};

export const cancelReservation = async (reservationID: number) => {
  const session = await getServerSession(authOptions);

  if (!session) {
    return {
      success: false,
      message: 'User not authenticated'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/reservations/${reservationID}/cancel`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to cancel reservation'
      };
    }
    
    revalidatePath('/admin/reservations');
    return {
      success: true,
      message: 'Reservation cancelled successfully'
    };
  } catch (error) {
    console.error('Error cancelling reservation:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An unexpected error occurred'
    };
  }
}