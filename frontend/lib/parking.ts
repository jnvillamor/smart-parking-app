'use server';

import { z } from 'zod';
import { AddLocationSchema } from './schema';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/app/api/auth/[...nextauth]/route';
import { revalidatePath } from 'next/cache';
import { PaginatedParkingLocations, ParkingSummary } from './types';

export const createParkingLocation = async (data: z.infer<typeof AddLocationSchema>) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to add a parking location.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/lots`, {
      method: 'POST',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to add parking location.'
      };
    }

    revalidatePath('/admin/locations');
    return {
      success: true,
      message: 'Parking location added successfully.'
    };
  } catch (error) {
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while adding the parking location.'
    };
  }
};

export const getParkingLocations = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to view parking locations.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/lots`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch parking locations.'
      };
    }

    const data = await res.json() as PaginatedParkingLocations;
    return {
      success: true,
      data: data,
      message: 'Parking locations fetched successfully.'
    };
  } catch (error) {
    console.error('Error fetching parking locations:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while fetching parking locations.'
    };
  }
}

export const updateParkingLocation = async (id: number, data: z.infer<typeof AddLocationSchema>) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to update a parking location.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/lots/${id}`, {
      method: 'PUT',
      body: JSON.stringify(data),
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to update parking location.'
      };
    }

    revalidatePath('/admin/locations');
    return {
      success: true,
      message: 'Parking location updated successfully.'
    };
  } catch (error) {
    console.error('Error updating parking location:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while updating the parking location.'
    };
  }
}


export const deleteParkingLocation = async (id: number) => {
  const seession = await getServerSession(authOptions);

  if (!seession) {
    return {
      success: false,
      message: 'You must be logged in to delete a parking location.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/lots/${id}`, {
      method: 'DELETE',
      headers: {
        Authorization: `Bearer ${seession.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to delete parking location.'
      };
    }

    revalidatePath('/admin/locations');
    return {
      success: true,
      message: 'Parking location deleted successfully.'
    };
  } catch (error) {
    console.error('Error deleting parking location:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while deleting the parking location.'
    };
  }
}

export const getParkingSummary = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to view parking summary.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/summary`, {
      method: 'GET',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch parking summary.'
      };
    }

    const data = await res.json() as ParkingSummary;
    return {
      success: true,
      data: data,
      message: 'Parking summary fetched successfully.'
    }
  } catch (error) {
    console.error('Error fetching parking summary:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while fetching parking summary.'
    };
  }
};

export const toggleParkingLocationStatus = async (id: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to toggle parking location status.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/parking/lots/${id}/toggle-status`, {
      method: 'PATCH',
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    })
    console.log(res)

    if (!res.ok) {
      const errorData = await res.json();
      return {
        success: false,
        message: errorData.detail || 'Failed to update parking location status.'
      };
    }

    revalidatePath('/admin/locations');
    return {
      success: true,
      message: 'Parking location status updated successfully.'
    };
    
  } catch (error) {
    console.error('Error updating parking location status:', error);
    return {
      success: false,
      message: error instanceof Error ? error.message : 'An error occurred while toggling parking location status.'
    }
    
  }
}