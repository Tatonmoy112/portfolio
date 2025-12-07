import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Identify if we are accessing a protected route
    const { pathname } = request.nextUrl;

    // Check for the authentication cookie
    const isAuthenticated = request.cookies.has('admin_session');

    // 2. Block direct access to /login/studio (redirect to /login)
    if (pathname.startsWith('/login/studio')) {
        if (!isAuthenticated) {
            // Redirect unauthenticated users to /login
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/login';
            return NextResponse.redirect(loginUrl);
        }
        // If authenticated, allow access to /login/studio
        return NextResponse.next();
    }

    // 3. Protect /studio route (other than /login/studio)
    if (pathname.startsWith('/studio')) {
        if (!isAuthenticated) {
            // Redirect unauthenticated users to /login
            const loginUrl = request.nextUrl.clone();
            loginUrl.pathname = '/login';
            loginUrl.searchParams.set('next', pathname);
            return NextResponse.redirect(loginUrl);
        }
        // If authenticated, allow access to /studio
        return NextResponse.next();
    }

    // 4. For all other routes, continue normally
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply to all routes under /studio and /login/studio
        '/studio/:path*',
        '/login/studio/:path*'
    ],
};
