'use server';

import { z } from 'zod';
import { UpdatePasswordSchema, UpdateProfileSchema } from './schema';
import { getServerSession, Session } from 'next-auth';
import { revalidatePath } from 'next/cache';
import { authOptions } from '@/app/api/auth/options';
import { PaginatedUsers, UserSummary } from './types';
import { SearchParams } from 'next/dist/server/request/search-params';

export const updateUserProfile = async (data: z.infer<typeof UpdateProfileSchema>, session: Session) => {
  try {
    const body = JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email
    });

    const res = await fetch(`${process.env.API_BASE_URL}/users/${session.user.id}`, {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Profile update failed:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to update profile. Please try again.'
      };
    }

    revalidatePath('/profile');
    return {
      success: true,
      message: 'Profile updated successfully!'
    };
  } catch (error) {
    console.error('Error updating user profile:', error);
    return {
      success: false,
      message: 'Failed to update profile. Please try again later.'
    };
  }
};

export const updateUserPassword = async (data: z.infer<typeof UpdatePasswordSchema>) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to update your password.'
    };
  }

  const body = JSON.stringify({
    old_password: data.currentPassword,
    new_password: data.newPassword
  });

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/change-password/${session.user.id}`, {
      method: 'PUT',
      body: body,
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Password update failed:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to update password. Please try again.'
      };
    }

    revalidatePath('/profile');
    return {
      success: true,
      message: 'Password updated successfully!'
    };
  } catch (error) {
    console.error('Error updating user password:', error);
    return {
      success: false,
      message: 'Failed to update password. Please try again later.'
    };
  }
};

export const getUserSummary = async () => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to view your summary.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/summary`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });
    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch user summary:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch user summary. Please try again.'
      };
    }

    const data = (await res.json()) as UserSummary;
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching user summary:', error);
    return {
      success: false,
      message: 'Failed to fetch user summary. Please try again later.'
    };
  }
};

export const getPaginatedUsers = async (params?: SearchParams) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to view users.'
    };
  }

  try {
    const entries: [string, string][] = [];

    Object.entries(params ?? {}).forEach(([key, value]) => {
      if (typeof value === 'string') {
        entries.push([key, value]);
      } else if (Array.isArray(value)) {
        value.forEach((v) => entries.push([key, v]));
      }
    });
    const queryParams = new URLSearchParams(entries).toString();

    const res = await fetch(`${process.env.API_BASE_URL}/users?${queryParams}`, {
      headers: {
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to fetch users:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to fetch users. Please try again.'
      };
    }

    const data = await res.json() as PaginatedUsers;
    return {
      success: true,
      data: data
    };
  } catch (error) {
    console.error('Error fetching users:', error);
    return {
      success: false,
      message: 'Failed to fetch users. Please try again later.'
    };
  }
};

export const deactivateUser = async (userId: number, message?: string) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to deactivate a user.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/${userId}/deactivate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      },
      body: JSON.stringify({
        message: message || 'User deactivated by admin'
      })
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to deactivate user:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to deactivate user. Please try again.'
      };
    }

    revalidatePath('/users');
    return {
      success: true,
      message: 'User deactivated successfully!'
    };
  } catch (error) {
    console.error('Error deactivating user:', error);
    return {
      success: false,
      message: 'Failed to deactivate user. Please try again later.'
    };
  }
}

export const activateUser = async (userId: number) => {
  const session = await getServerSession(authOptions);
  if (!session) {
    return {
      success: false,
      message: 'You must be logged in to activate a user.'
    };
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/users/${userId}/activate`, {
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${session.accessToken}`
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.error('Failed to activate user:', errorData);
      return {
        success: false,
        message: errorData.detail || 'Failed to activate user. Please try again.'
      };
    }

    revalidatePath('/users');
    return {
      success: true,
      message: 'User activated successfully!'
    };
  } catch (error) {
    console.error('Error activating user:', error);
    return {
      success: false,
      message: 'Failed to activate user. Please try again later.'
    };
  }
}