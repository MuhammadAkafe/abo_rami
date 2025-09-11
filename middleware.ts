import type { NextRequest } from 'next/server'
import { NextResponse } from 'next/server'
import jwt from 'jsonwebtoken'
import { prisma } from '@/app/(lib)/prisma'

const checkToken = async (id: number) => 
    {
    await prisma.users.findUnique({
        where: {
            id: id
        }
    })
    return "ADMIN"
}

export async function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  if (!token) {
    return NextResponse.redirect(new URL('/Login', request.url))    
  }
  const decoded = jwt.verify(token, process.env.PUBLIC_KEY as string)
  if (!decoded) {
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const userId = (typeof decoded === 'object' && 'userId' in decoded) ? (decoded as any).userId : undefined;
  if (!userId) {
    return NextResponse.redirect(new URL('/Login', request.url))
  }
  // Verify user exists in database
  await checkToken(Number(userId));
  
  // All authenticated users (both ADMIN and non-ADMIN) should be redirected to dashboard
  // if they're trying to access the root path or login/register pages
  if(
     request.nextUrl.pathname === '/Login' || 
     request.nextUrl.pathname === '/Register'){
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }
  
  // Allow access to dashboard and related admin routes for all authenticated users
  return NextResponse.next()
}

export const config = {
  matcher: ['/','/dashboard','/AddTask','/DeleteTask'],
  runtime: 'nodejs',
}