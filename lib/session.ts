import { cookies } from 'next/headers'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/constans/constans'

type cities = {id: number, city: string,supplierId: number}[]

export interface SessionData {
  id: number
  email: string
  role: string
  firstName: string
  lastName: string
  cities: cities
}

export async function createSession(supplierData: SessionData): Promise<void> {


  const cookieStore = await cookies()
  cookieStore.set('supplier-session', JSON.stringify(supplierData), {
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
    const data = cookieStore.get('supplier-session')?.value

    return data ? JSON.parse(data) as SessionData : null
  } 
  catch (error) 
  {
    console.error('Session verification error:', error)
    return null
  }
}

export async function clearSession(): Promise<void> 
{
  const cookieStore = await cookies()
  cookieStore.delete('supplier-session')
}

export async function requireAuth(): Promise<void> 
{
  const session = await getSession()
  if (!session || session.role!=="USER") {
    redirect(CLIENT_ROUTES.SIGN_IN);
  }

}
