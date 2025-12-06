import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
    const path = request.nextUrl.pathname;

    // Protect /studio routes, but allow /studio/login
    if (path.startsWith('/studio') && !path.startsWith('/studio/login')) {
        const adminSession = request.cookies.get('admin_session');

        if (!adminSession) {
            return NextResponse.redirect(new URL('/studio/login', request.url));
        }
    }

    return NextResponse.next();
}

export const config = {
    matcher: '/studio/:path*',
}
