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
  const role = await checkToken(Number(userId));

  if(role !== 'ADMIN'){
    if(request.nextUrl.pathname === '/dashboard'){
      return NextResponse.redirect(new URL('/Login', request.url))
    }
  }
  return NextResponse.next()
  // Allow access to dashboard and related admin routes for all authenticated users
  //return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard'],
  runtime: 'nodejs',
}