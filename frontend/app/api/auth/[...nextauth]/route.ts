import { getCurrentUser, loginUser, refreshToken } from '@/lib/auth';
import { UserProfile } from '@/lib/types';
import NextAuth, { AuthOptions } from 'next-auth';
import Credentials from 'next-auth/providers/credentials';

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

        const data = await loginUser(credentials);

        return {
          id: data.user.id,
          user: data.user,
          accessToken: data.access_token,
          accessTokenExpires: data.access_token_expires,
          refreshToken: data.refresh_token,
          refreshTokenExpires: data.refresh_token_expires,
          role: data.user.role || 'user'
        };
      }
    })
  ],
  callbacks: {
    async jwt({ token, user }) {
      // if user is defined, it means this is the first time the JWT is being created
      if (user) {
        return {
          ...token,
          accessToken: user.accessToken,
          accessTokenExpires: user.accessTokenExpires,
          refreshToken: user.refreshToken,
          refreshTokenExpires: user.refreshTokenExpires,
          user: user.user
        };
      }

      // Refetch the user profile for accurate user data
      if (token.accessTokenExpires && Date.now() < (token.accessTokenExpires * 1000)) {
        const user = await getCurrentUser(token.accessToken);

        if (user) token.user = user;

        return token;
      }

      console.log('Access token expired, refreshing...');
      return refreshToken(token);
    },

    async session({ session, token }) {
      if (token) {
        session.accessToken = token.accessToken as string;
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
