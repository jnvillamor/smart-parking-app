import { getCurrentUser, loginUser, refreshToken } from '@/lib/auth';
import { UserProfile } from '@/lib/types';
import { AuthOptions } from 'next-auth';
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

          const res = await loginUser(credentials);
          
          if( res.error ) {
            console.error('Login failed:', res.message);
            throw new Error(res.message || 'Login failed. Please check your credentials and try again.');
          }

          const data = res.data;
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
      if (token.accessTokenExpires && Date.now() < token.accessTokenExpires * 1000) {
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
