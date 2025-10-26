'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/constans/constans'
import { clearSession } from '@/lib/session'

export async function loginAction(formData: FormData): Promise<void> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  if (!email || !password) {
    throw new Error('כתובת אימייל וסיסמה נדרשים')
  }

  try {
    // Find supplier by email
    const supplier = await prisma.suppliers.findUnique({
      where: {
        email: email,
      },
      include: {
        cities: true
      }
    })

    if (!supplier) {
      throw new Error('ספק לא נמצא עם כתובת אימייל זו')
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, supplier.password as string)
    if (!isPasswordValid) {
      throw new Error('סיסמה שגויה')
    }

    // Create session
    await createSession(supplier)
    // Redirect to dashboard on success
    redirect(CLIENT_ROUTES.SUPPLIER.DASHBOARD)
  } 
  catch (error) {
    // Check if it's a Next.js redirect error (which is expected)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw redirect errors
    }
    
    console.error('Login error:', error)
    throw error // Re-throw other errors
  }
}

export async function logoutAction() {
  await clearSession()
  redirect(CLIENT_ROUTES.SUPPLIER.SIGN_IN)
}
