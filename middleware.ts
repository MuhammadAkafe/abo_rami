
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
        return NextResponse.json({ error: "You are not authorized to access this page"}, { status: 403 })
      }
    }

    if (pathname.startsWith('/api/ADMIN/AddTask' ) || 
    pathname.startsWith('/api/ADMIN/DeleteTask') || 
    pathname.startsWith('/api/ADMIN/DeleteSupplier') ||
     pathname.startsWith('/api/ADMIN/GetAllSuppliers')) {
      // Only ADMIN can access these pages
      if (token?.role !== Role.ADMIN) {
        console.log('User is not an admin')
        return NextResponse.json({ error: "You are not authorized to access this page"}, { status: 403 })
      }
    }

    if (pathname.startsWith('/Tasklist')) {
      // Only USER can access Tasklist (ADMIN should go to dashboard)
      if (token?.role !== Role.USER) {
       return NextResponse.json({ error: "You are not authorized to access this page"}, { status: 403 })
      }
    }

    return NextResponse.next()
  },
)

export const config = {
  matcher: [
    '/api/ADMIN/:path*',
    '/dashboard/:path*', 
    '/Tasklist/:path*',
    '/api/GetAllUsers/:path*',
    '/api/GetAllSuppliers/:path*',
    '/api/GetAllCities/:path*',
    '/api/Supplier/:path*',
    '/SystemPermissions/:path*',
  ],  
}