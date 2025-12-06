
import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
    // 1. Identify if we are accessing a protected route
    const { pathname } = request.nextUrl;
    const isStudioRoute = pathname.startsWith('/studio');

    // Note: Since login is now at /login, we don't strictly need to check isLoginRoute inside /studio
    // But good to keep exclude logic if we expand.
    const isLoginRoute = pathname === '/login';

    // If it's not a studio route (or is the login route), do nothing
    if (!isStudioRoute || isLoginRoute) {
        return NextResponse.next();
    }

    // 2. Check for the authentication cookie
    // We use "admin_session" as defined in your login page logic
    const isAuthenticated = request.cookies.has('admin_session');

    // 3. If not authenticated, redirect to login with the return URL
    if (!isAuthenticated) {
        // Use clone() to ensure we keep the basePath (e.g. /portfolio)
        const loginUrl = request.nextUrl.clone();
        loginUrl.pathname = '/login';
        // Add the current path as a "next" parameter to redirect back after login
        loginUrl.searchParams.set('next', pathname);

        return NextResponse.redirect(loginUrl);
    }

    // 4. If authenticated, allow the request to proceed
    return NextResponse.next();
}

export const config = {
    matcher: [
        // Apply to all routes under /studio
        '/studio/:path*',
    ],
};
