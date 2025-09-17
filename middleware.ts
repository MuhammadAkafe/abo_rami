
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"

export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token


    // Strict role-based access control
    if (pathname.startsWith('/dashboard')) {
      // Only ADMIN can access dashboard
      if (token?.role !== Role.ADMIN) {
        console.log('User is not an admin')
        return NextResponse.redirect(new URL('/', req.url))
      }
    }

    if (pathname.startsWith('/api/AddTask' ) || 
    pathname.startsWith('/api/DeleteTask') || 
    pathname.startsWith('/api/DeleteSupplier') ||
     pathname.startsWith('/api/GetAllSuppliers') || 
     pathname.startsWith('/api/AddSupplier')) 
      {
      // Only ADMIN can access these pages
      if (token?.role !== Role.ADMIN) {
        console.log('User is not an admin')
        return NextResponse.json({ error: "You are not authorized to access this page"}, { status: 403 })
      }
    }

    if (pathname.startsWith('/Tasklist')) {
      // Only USER can access Tasklist (ADMIN should go to dashboard)
      if (token?.role !== Role.USER) {
       return NextResponse.redirect(new URL(`/`, req.url))
      }
    }

    return NextResponse.next()
  },
  {
    callbacks: {
      authorized: ({ token, req }) => {
        const { pathname } = req.nextUrl
        
        // Allow access to login and register pages without authentication
        if (pathname === '/Login' || pathname === '/Register' || pathname === '/AdminLogin') {
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
    '/Tasklist/:path*',
    '/api/AddTask/:path*',
    '/api/DeleteTask/:path*',
    '/api/DeleteUser/:path*',
    '/api/GetAllUsers/:path*',
    '/api/AddAdmin/:path*',
    '/api/AddSupplier/:path*',
  ],
}