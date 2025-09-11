import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { NextRequest } from "next/server";

export async function POST(request: NextRequest) {
  try {
    const cookieStore = await cookies();
    cookieStore.delete('token');
    return NextResponse.redirect(new URL('/Login', request.url));
  } 
  catch (error) 
  {
    console.error('Logout error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
