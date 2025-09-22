import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth/next';
import { Role } from '@prisma/client';
import { authOptions } from '../[...nextauth]/route';

export async function GET(request: NextRequest) {
  try {
    const session = await getServerSession(authOptions);
    
    if (!session) {
      // No session, redirect to main page to choose login type
      return NextResponse.redirect(new URL('/', request.url));
    }

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const userRole = (session as any)?.user?.role;
    
    if (userRole === Role.ADMIN) {
      return NextResponse.redirect(new URL('/ADMIN/dashboard', request.url));
    } else if (userRole === Role.USER) {
      return NextResponse.redirect(new URL('/USER/AddCitties', request.url));
    } else {
      // Unknown role, redirect to main page
      return NextResponse.redirect(new URL('/', request.url));
    }
  } catch (error) {
    console.error('Error in role-based login:', error);
    return NextResponse.redirect(new URL('/', request.url));
  }
}
