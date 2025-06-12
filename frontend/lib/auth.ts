'use server';

import { z } from 'zod';
import { RegistrationSchema } from './schema';
import { JWT } from 'next-auth/jwt';
import { UserProfile } from './types';

export const registerUser = async (data: z.infer<typeof RegistrationSchema>) => {
  try {
    // Prepare the request to the registration endpoint
    const body = JSON.stringify({
      first_name: data.firstName,
      last_name: data.lastName,
      email: data.email,
      password: data.password
    });

    const res = await fetch(`${process.env.API_BASE_URL}/auth/register`, {
      method: 'POST',
      body: body,
      headers: {
        'Content-Type': 'application/json'
      }
    });

    if (!res.ok) {
      const errorData = await res.json();
      console.log('Registration failed:', errorData);
      return {
        success: false,
        message: errorData.message || 'Registration failed. Please try again.'
      };
    }
    const responseData = await res.json();
    console.log('Registration successful:', responseData);
    return {
      success: true,
      message: 'Registration successful! Logging you in...'
    };
  } catch (error) {
    console.log('Error during registration:', error);
    return {
      success: false,
      message: 'Failed to register. Please try again later.'
    };
  }
};

export const refreshToken = async (token: JWT) => {
  try {
    if (!token.refreshToken) {
      console.error('No refresh token available');
      token.error = true;
      return token;
    }

    const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      headers: {
        Authorization: `Bearer ${token.refreshToken}`
      }
    });

    if (!res.ok) {
      console.error('Failed to refresh token:', res.statusText);
      token.error = true;
      return token;
    }

    // Update the token with new access and refresh tokens
    const data = await res.json();
    return {
      ...token,
      accessToken: data.access_token,
      accessTokenExpires: new Date(data.access_token_expires),
      refreshToken: data.refresh_token ?? token.refreshToken,
      refreshTokenExpires: data.refresh_token_expires
    };
  } catch (error) {
    console.error('Error refreshing token:', error);
    token.error = true;
    return token;
  }
};

export const loginUser = async (credentials: Record<'email' | 'password', string> | undefined) => {
  if (!credentials || !credentials.email || !credentials.password) {
    return null;
  }

  // Create a new FormData object to send credentials
  const form = new FormData();
  form.append('username', credentials.email);
  form.append('password', credentials.password);

  const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
    method: 'POST',
    body: form
  });

  if (!res.ok) {
    console.error('Error in login:', res.statusText);
    return null;
  }

  const data = await res.json();
  if (!data) {
    console.error('Invalid login response:', data);
    return null;
  }

  return data;
};

export const getCurrentUser = async (token: string) => {
  if (!token) {
    console.error('No token provided');
    return null;
  }

  try {
    const res = await fetch(`${process.env.API_BASE_URL}/auth/me`, {
      headers: {
        Authorization: `Bearer ${token}`
      }
    });

    if (!res.ok) {
      console.error('Failed to fetch current user:', res.statusText);
      return null;
    }

    const data: UserProfile = await res.json();

    if (!data) {
      console.error('Invalid user data:', data);
      return null;
    }

    return data;
    
  } catch (error) {
    console.error('Error fetching current user:', error);
    return null;
  }
};
