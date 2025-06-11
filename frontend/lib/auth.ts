'use server'

import { z } from 'zod';
import { RegistrationSchema } from './schema';

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
    }
  } catch (error) {
    console.log('Error during registration:', error);
    return {
      success: false,
      message: 'Failed to register. Please try again later.'
    };
  }
};
