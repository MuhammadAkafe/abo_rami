import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/app/(lib)/prisma'

const checkToken = async (id: number) => 
    {
    const user = await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    return user?.role
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/Login', request.url))    
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  let decoded: any;
  try {
    decoded = jwt.verify(token, process.env.PUBLIC_KEY as string)
    if (!decoded) {
      return NextResponse.redirect(new URL('/Login', request.url))
    }
  } catch (error) {
    // Handle JWT errors (expired, invalid, etc.)
    if (error instanceof jwt.TokenExpiredError) {
      return NextResponse.redirect(new URL('/Login', request.url))
    }
    if (error instanceof jwt.JsonWebTokenError) {
      return NextResponse.redirect(new URL('/Login', request.url))
    }
    // For any other errors, also redirect to login
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (typeof decoded === 'object' && 'userId' in decoded) ? (decoded as any).userId : undefined;
  if (!userId) {
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  // Verify user exists in database
  const role = await checkToken(Number(userId));
  if(request.nextUrl.pathname === '/dashboard' && role !== 'ADMIN'){
    return NextResponse.redirect(new URL('/Tasklist', request.url))
  }
  else if(request.nextUrl.pathname === '/Tasklist' && role !== 'USER'){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
  // Allow access to dashboard and related admin routes for all authenticated users
  //return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard','/addTask','/deleteTask','/Tasklist'],
  runtime: 'nodejs',
}