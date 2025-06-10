import { UserProfile } from '@/lib/types';
import { jwtDecode } from 'jwt-decode';
import NextAuth, { AuthOptions } from 'next-auth';
import { JWT } from 'next-auth/jwt';
import Credentials from 'next-auth/providers/credentials';

const refreshToken = async (token: JWT) => {
  try {
    if (!token.refreshToken) {
      console.error('No refresh token available');
      token.error = true;
      return token;
    }

    const res = await fetch(`${process.env.API_BASE_URL}/auth/refresh`, {
      headers: {
        "Authorization": `Bearer ${token.refreshToken}`
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
      refreshToken: data.refresh_token ?? token.refreshToken
    }

  } catch (error) {
    console.error('Error refreshing token:', error);
    token.error = true;
    return token;
  }
};

export const authOptions: AuthOptions = {
  session: {
    strategy: 'jwt'
  },
  providers: [
    Credentials({
      name: 'Credentials',
      credentials: {
        email: { label: 'Email', type: 'email', placeholder: 'Email' },
        password: { label: 'Password', type: 'password', placeholder: 'Password' }
      },

      async authorize(credentials) {
        if (!credentials || credentials === null || !credentials.email || !credentials.password) return null;

        // Create a FormData object to send credentials
        const form = new FormData();
        form.append('username', credentials?.email || '');
        form.append('password', credentials?.password || '');

        const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: 'POST',
          body: form
        });

        if (!res.ok) {
          console.log('Error in authorize:', res.statusText);
          return null;
        }

        const data = await res.json();
        if (!data || !data.user) {
          console.log('Invalid login response:', data);
          return null;
        }

        return {
          id: data.user.id,
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          role: data.user.role || 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // if the token already has an access token, check the expiration
      if (token.accessToken) {
        const { exp } = jwtDecode<{ exp: number }>(token.accessToken);

        if (exp) {
          token.accessTokenExpires = exp * 1000;
        }
      }

      // if user is defined, it means this is the first time the JWT is being created
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
          user: user.user
        };
      }

      // If the access token is still valid, return the token as is
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires) {
        return token;
      }

      console.log('Access token expired, refreshing...');
      return refreshToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
        session.refreshToken = token.refreshToken as string;
        session.user = token.user as UserProfile;
      }

      return session;
    }
  },
  pages: {
    signIn: '/auth/login'
  }
};

const handler = NextAuth(authOptions);

declare module 'next-auth' {
  interface User {
    accessToken: string;
    refreshToken: string;
    role: string;
    user: UserProfile;
  }

  interface Session {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    error?: boolean;
    user: UserProfile;
  }
}

export { handler as GET, handler as POST };
