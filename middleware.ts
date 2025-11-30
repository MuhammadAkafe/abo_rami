import { NextRequest, NextResponse } from "next/server";
import { getSession } from "./lib/session";


export const middleware = async (request: NextRequest) => {
    const { pathname } = request.nextUrl;
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // Check role-based access for API routes
    // USER role cannot access ADMIN routes
    if (session.role === 'USER' && pathname.includes('/api/ADMIN')) {
        return NextResponse.redirect(new URL('/', request.url));
    }
    
    // ADMIN role cannot access USER routes
    if (session.role === 'ADMIN' && pathname.includes('/api/USER')) {
        return NextResponse.redirect(new URL('/', request.url));
    }

    return NextResponse.next();
}

export const config = {
    runtime: 'nodejs',
    matcher: [
        '/api/:path*',
    ]
}