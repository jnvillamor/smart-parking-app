'use server';

import { authOptions } from '@/app/api/auth/options';
import { getServerSession } from 'next-auth';
import { AdminSummary } from './types';

export const getSummaryData = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'Unauthorized access',
      data: null
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/admin/summary`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch summary data',
        data: null
      };
    }

    const data = await res.json() as AdminSummary;
    return {
      success: true,
      message: 'Summary data fetched successfully',
      data: data
    };
  } catch (error) {
    console.error('Error fetching summary data:', error);
    return {
      success: false,
      message: 'Failed to fetch summary data',
      data: null
    };
  }
};
