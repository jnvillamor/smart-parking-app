import { UserProfile } from "@/lib/types";
import NextAuth, { AuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  session: {
    strategy: "jwt",
  },
  providers: [
    Credentials({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "email", placeholder: "Email"},
        password: { label: "Password", type: "password", placeholder: "Password" }
      },

      async authorize(credentials) {
        if (!credentials || credentials === null || !credentials.email || !credentials.password) return null;

        // Create a FormData object to send credentials
        const form = new FormData();
        form.append("username", credentials?.email || "");
        form.append("password", credentials?.password || "");

        const res = await fetch(`${process.env.API_BASE_URL}/auth/login`, {
          method: "POST",
          body: form,
        })

        if (!res.ok) {
          console.log("Error in authorize:", res.statusText);
          return null;
        }

        const data = await res.json();
        if (!data || !data.user) {
          console.log("Invalid login response:", data);
          return null;
        }

        return {
          id: data.user.id,
          user: data.user,
          accessToken: data.access_token,
          refreshToken: data.refresh_token,
          role: data.user.role || "user",
        }
      }
    })
  ],
  callbacks: {
    async jwt({ token, user, account }) {
      // if user is defined, it means this is the first time the JWT is being created
      if (user && account) {
        return {
          ...token,
          accessToken: user.accessToken,
          refreshToken: user.refreshToken,
        }
      }

      return token;
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
    signIn: "/auth/login",
  }
}

const handler = NextAuth(authOptions);

declare module "next-auth" {
  interface User {
    accessToken: string;
    refreshToken: string;
    role: string;
  }

  interface Session {
    user: UserProfile;
    accessToken: string;
    refreshToken: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    refreshToken: string;
    accessTokenExpires?: number;
    user: UserProfile;
  }
}

export { handler as GET, handler as POST };