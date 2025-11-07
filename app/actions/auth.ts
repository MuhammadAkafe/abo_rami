'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/constans/constans'
import { clearSession } from '@/lib/session'

export async function loginAction(formData: FormData): Promise<{ success: boolean; message?: string }> {
  const email = formData.get('email') as string
  const password = formData.get('password') as string

  // Validate input
  if (!email || !password) {
    return { success: false, message: 'כתובת אימייל וסיסמה נדרשים' }
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
      return { success: false, message: 'ספק לא נמצא עם כתובת אימייל זו' }
    }

    // Verify password
    const isPasswordValid = await bcrypt.compare(password, supplier.password as string)
    if (!isPasswordValid) {
      return { success: false, message: 'סיסמה שגויה' }
    }

    // Create session
    await createSession({
      id: supplier.id,
      email: supplier.email,
      role: 'USER',
      firstName: supplier.firstName,
      lastName: supplier.lastName,
      cities: supplier.cities
    })
    
    // Return success instead of redirecting
    return { success: true }
  } 
  catch (error) {
    console.error('Login error:', error)
    return { success: false, message: 'שגיאה פנימית בשרת' }
  }
}

export async function logoutAction() {
  await clearSession()
  redirect(CLIENT_ROUTES.SUPPLIER.SIGN_IN)
}
