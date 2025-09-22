
import { withAuth } from "next-auth/middleware"
import { NextResponse } from "next/server"
import { Role } from "@prisma/client"

// Route patterns for better maintainability
const ROUTE_PATTERNS = {
  DASHBOARD: '/ADMIN/dashboard',
  TASKLIST: '/USER/Tasklist',
  ADMIN_API: '/api/ADMIN',
  SYSTEM_PERMISSION: '/api/SystemPermission/AddAdmin',
} as const

// Admin-only API routes
const ADMIN_API_ROUTES = [
  '/api/ADMIN/AddTask',
  '/api/ADMIN/DeleteTask', 
  '/api/ADMIN/DeleteSupplier',
  '/api/ADMIN/GetAllSuppliers'
] as const

// Error messages
const ERROR_MESSAGES = {
  UNAUTHORIZED: "You are not authorized to access this page",
  ACCESS_DENIED: "Access denied"
} as const

// Helper function to check if path matches any of the given patterns
const matchesAnyPattern = (pathname: string, patterns: readonly string[]): boolean => {
  return patterns.some(pattern => pathname.startsWith(pattern))
}

// Helper function to create unauthorized response
const createUnauthorizedResponse = (message: string = ERROR_MESSAGES.UNAUTHORIZED) => {
  return NextResponse.json({ error: message }, { status: 403 })
}

// Helper function to validate admin access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateAdminAccess = (token: any, pathname: string): NextResponse | null => {
  if (token?.role !== Role.ADMIN) {
    console.log(`Access denied: User is not an admin for path: ${pathname}`)
    return createUnauthorizedResponse()
  }
  return null
}

// Helper function to validate user access
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const validateUserAccess = (token: any, pathname: string): NextResponse | null => {
  if (token?.role !== Role.USER) {
    console.log(`Access denied: User is not authorized for path: ${pathname}`)
    return createUnauthorizedResponse()
  }
  return null
}

// Main middleware function
export default withAuth(
  function middleware(req) {
    const { pathname } = req.nextUrl
    const token = req.nextauth.token

    // Dashboard access - ADMIN only
    if (pathname.startsWith(ROUTE_PATTERNS.DASHBOARD)) {
      const response = validateAdminAccess(token, pathname)
      if (response) return response
    }


    // Admin API routes - ADMIN only
    if (matchesAnyPattern(pathname, ADMIN_API_ROUTES)) {
      const response = validateAdminAccess(token, pathname)
      if (response) return response
    }

    // Tasklist access - USER only
    if (pathname.startsWith(ROUTE_PATTERNS.TASKLIST)) {
      const response = validateUserAccess(token, pathname)
      if (response) return response
    }

    return NextResponse.next()
  },
)

// Matcher configuration
export const config = {
  matcher: [
    '/ADMIN/dashboard/:path*', 
    '/USER/Tasklist/:path*',
    '/api/ADMIN/:path*',
    '/api/GetAllUsers/:path*',
    '/api/GetAllSuppliers/:path*',
    '/api/GetAllCities/:path*',
    '/api/Supplier/:path*',
  ],  
}