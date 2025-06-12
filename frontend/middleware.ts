import { withAuth } from 'next-auth/middleware';
import { NextResponse } from 'next/server';

const AUTH_PATHS = ['/auth/login', '/auth/register'];

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl;
    const session = req.nextauth?.token;
    const isAdmin = session?.user?.role === 'admin';

    if (pathname === '/') {
      return NextResponse.next();
    }

    if (AUTH_PATHS.includes(pathname)) {
      if (!session) return NextResponse.next();

      // If the user is authenticated, redirect them to the appropriate dashboard
      const redirectUrl = isAdmin ? '/admin/dashboard' : '/dashboard';
      return NextResponse.redirect(new URL(redirectUrl, req.url));
    }

    // If the user is not andministrator and tries to access admin routes, redirect them
    if (pathname.startsWith('/admin') && !isAdmin) {
      return NextResponse.redirect(new URL('/dashboard', req.url));
    }

    if (!pathname.startsWith('/admin') && isAdmin) {
      // If the user is an administrator and tries to access non-admin routes, redirect them to admin dashboard
      return NextResponse.redirect(new URL('/admin/dashboard', req.url));
    }

    return NextResponse.next();
  },
  {
    pages: {
      signIn: '/auth/login',
      error: '/auth/error',
    },
    callbacks: {
      // 👇 Only require auth for specific routes
      authorized({ req, token }) {
        const pathname = req.nextUrl.pathname;

        // Allow unauthenticated access to the root and auth pages
        if (pathname === '/' || AUTH_PATHS.includes(pathname)) {
          return true;
        }

        // Require authentication for everything else
        return !!token;
      }
    }
  }
);

export const config = {
  matcher: [
    /*
     * Match all routes except:
     * - static files
     * - API routes
     */
    '/((?!_next/static|_next/image|favicon.ico|api).*)'
  ]
};
