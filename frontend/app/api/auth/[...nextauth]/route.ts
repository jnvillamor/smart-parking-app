import { UserProfile } from '@/lib/types';
import NextAuth from 'next-auth';
import { authOptions } from '../options';

const handler = NextAuth(authOptions);

declare module 'next-auth' {
  interface User {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires: number;
    role: string;
    user: UserProfile;
  }

  interface Session {
    user: UserProfile;
    accessToken: string;
  }
}

declare module 'next-auth/jwt' {
  interface JWT {
    accessToken: string;
    accessTokenExpires: number;
    refreshToken: string;
    refreshTokenExpires: number;
    error?: boolean;
    user: UserProfile;
  }
}

export { handler as GET, handler as POST };
