"use server"

import { cookies } from 'next/headers'
import crypto from 'crypto'


export interface SessionData {
  id: number
  email: string
  role: string
  firstName: string
  lastName: string
}

const genetateSessionId = () => 
  {
  return crypto.randomBytes(32).toString('hex') + Date.now().toString();
}

export async function createSession(Data: SessionData ): Promise<void>
 {

  const sessionId = genetateSessionId();
  const cookieStore = await cookies();
  cookieStore.set('session', sessionId, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })
}

export async function getSession(): Promise<string | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session')?.value
    if (!sessionId) {
      console.log("No session found");
      return null;
    }
    return sessionId  
  } 
  catch (error) 
  {
    console.error('Session verification error:', error)
    return null
  }
}

export async function clearSession(): Promise<void> 
{
  const sessionId = await getSession();
  if (!sessionId) {
    console.log(" failed to clear session No session found");
    return;
  }
  const cookieStore = await cookies();
  cookieStore.delete('session');
  return;
}


