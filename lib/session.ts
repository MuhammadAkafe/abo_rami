import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import jwt from 'jsonwebtoken'
import { supplierList } from '@/types/types'

export interface SessionData {
  supplierId: number
  clerkId: string
  email: string
  role: string
  firstName: string
  lastName: string
  cities: Array<{
    id: number
    city: string
    supplierId: number
  }>
}

export async function createSession(supplierData: supplierList): Promise<void> {
  const secret = process.env.JWT_SECRET
  if (!secret) {
    throw new Error('JWT_SECRET is not configured')
  }

  const token = jwt.sign(
    {
      supplierId: supplierData.id,
      email: supplierData.email,
      role: 'SUPPLIER',
      firstName: supplierData.firstName,
      lastName: supplierData.lastName,
      cities: supplierData.cities
    },
    secret,
    { expiresIn: '24h' }
  )

  const cookieStore = await cookies()
  cookieStore.set('supplier-session', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    maxAge: 24 * 60 * 60, // 24 hours
    path: '/'
  })
}

export async function getSession(): Promise<SessionData | null> {
  try {
    const cookieStore = await cookies()
    const token = cookieStore.get('supplier-session')?.value

    if (!token) {
      return null
    }

    const secret = process.env.JWT_SECRET
    if (!secret) {
      return null
    }

    const decoded = jwt.verify(token, secret) as SessionData
    return decoded
  } 
  catch (error) 
  {
    console.error('Session verification error:', error)
    return null
  }
}

export async function clearSession(): Promise<void> {
  const cookieStore = await cookies()
  cookieStore.delete('supplier-session')
}

export async function requireAuth(): Promise<SessionData> {
  const session = await getSession()
  if (!session) {
    redirect('/client/User/sign-in')
  }
  return session
}
