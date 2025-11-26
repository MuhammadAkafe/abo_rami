"use server"

import { cookies } from 'next/headers'
import crypto from 'crypto'
import { redisClient } from './redis'


const SESSION_EXPIRES = 24 * 60 * 60

export interface SessionData {
  id: number
  email: string
  role: string
  firstName: string
  lastName: string
  sessionId:string
}

export type CreateSessionInput = Omit<SessionData, 'sessionId'>

const generateSessionId = (): string => {
  return crypto.randomBytes(32).toString('hex') + Date.now().toString()
}

export async function createSession(data: CreateSessionInput): Promise<void> {
  try {
    const sessionId = generateSessionId()
    const cookieStore = await cookies()
    
    // Set cookie
    cookieStore.set('session_id', sessionId, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'lax',
      maxAge: SESSION_EXPIRES,
      path: '/'
    })
    // Store session data in Redis with the sessionId as the key
    await redisClient.set(`session:${sessionId}`, {
      ...data,
      sessionId
    }, {
      ex: SESSION_EXPIRES
    })
  } catch (error) {
    console.error('Failed to create session:', error)
  }
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    if (!sessionId) {
      console.log("No session found");
      return null;
    }
   const redisData= await redisClient.get(`session:${sessionId}`);
   return redisData as unknown as SessionData
  } 
  catch (error) 
  {
    console.error('Session verification error:', error)
    return null
  }
}



export async function clearSession(): Promise<void> {
  try {
    const cookieStore = await cookies()
    const sessionId = cookieStore.get('session_id')?.value
    
    if (!sessionId) {
      console.log("Failed to clear session: No session found")
      return
    }
    
    // Delete from Redis first
    await redisClient.del(`session:${sessionId}`);
    
    // Delete cookie
    cookieStore.delete('session_id')
  } catch (error) 
  {
    console.error('Failed to clear session:', error)

  }
}


