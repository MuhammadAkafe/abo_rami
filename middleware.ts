
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Strict role-based access control
    if (pathname.startsWith('/dashboard')) {
      // Only ADMIN can access dashboard
      if (token?.role !== 'ADMIN') {
        return NextResponse.redirect(new URL('/Tasklist', req.url))
      }
    }

    if (pathname.startsWith('/Tasklist')) {
      // Only USER can access Tasklist (ADMIN should go to dashboard)
      if (token?.role === 'ADMIN') {
        return NextResponse.redirect(new URL('/dashboard', req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to login and register pages without authentication
        if (pathname === '/Login' || pathname === '/Register') {
          return true
        }
        
        // Require authentication for protected routes
        if (pathname.startsWith('/dashboard') || pathname.startsWith('/Tasklist')) {
          return !!token
        }
        
        return true
      },
    },
  }
)

export const config = {
  matcher: [
    '/dashboard/:path*', 
    '/Tasklist/:path*'
  ],
}