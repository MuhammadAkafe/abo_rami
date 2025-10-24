import { NextRequest, NextResponse } from 'next/server';

export async function GET(request: NextRequest) {
  // Only allow this in development or for debugging
  if (process.env.NODE_ENV === 'production') {
    return NextResponse.json({ 
      error: 'This endpoint is only available in development' 
    }, { status: 403 });
  }

  return NextResponse.json({
    NODE_ENV: process.env.NODE_ENV,
    DATABASE_URL: process.env.DATABASE_URL ? 'Set (hidden for security)' : 'Not set',
    DATABASE_URL_LENGTH: process.env.DATABASE_URL?.length || 0,
    DATABASE_URL_STARTS_WITH: process.env.DATABASE_URL?.startsWith('postgresql://') || process.env.DATABASE_URL?.startsWith('postgres://'),
    CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? 'Set' : 'Not set',
    CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? 'Set' : 'Not set',
  });
}
