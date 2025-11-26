'use server'

import { prisma } from '@/lib/prisma'
import bcrypt from 'bcryptjs'
import { createSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/app/constans/constans'

export async function Adminlogin(formData: FormData): Promise<void  > {
    const email = formData.get('email') as string
    const password = formData.get('password') as string
  
    // Validate input
    if (!email || !password) {
      console.log("email or password are required");
      return 
    }
  
    try {
      // Find user by email
      const user = await prisma.users.findUnique({
        where: {
          email: email,
        },
      })
  
      if (!user) {
        console.log("user not found");
        return;
      }
  
  
      // Verify password
      const isPasswordValid = await bcrypt.compare(password, user.password as string);
  
      if (!isPasswordValid) {
        console.log("invaild creadintals");
        return;
      }
  
      // Create session
      await createSession({
        id: user.id,
        email: user.email,
        role: user.role,
        firstName: user.firstName,
        lastName: user.lastName,
      })
      redirect(CLIENT_ROUTES.ADMIN.DASHBOARD as string)
    } 
    catch (error) {
      // Re-throw redirect errors - they are expected and should propagate
      if (error && typeof error === 'object' && 'digest' in error) {
        const digest = (error as { digest?: string }).digest
        if (typeof digest === 'string' && digest.startsWith('NEXT_REDIRECT')) {
          throw error
        }
      }
      console.error('Login error:', error)
    }
  }
  