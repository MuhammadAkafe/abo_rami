import { verifyWebhook } from '@clerk/nextjs/webhooks'
import { NextRequest, NextResponse } from 'next/server'
import { prisma } from '@/lib/prisma'
import { UserJSON } from '@clerk/nextjs/server'
import { Role } from '@prisma/client'
import { clerkClient } from '@clerk/nextjs/server'









const UserCreated=async (user:UserJSON): Promise<NextResponse> => {
  const { id, email_addresses, first_name, last_name } = user
    try {
      // Check if user already exists in database
      const existingUser = await prisma.users.findUnique({
        where: { clerkid: id }
      })
      
      // If user already exists, it means they were created by admin (AddSupplier API)
      // Skip webhook creation to avoid conflicts
      if (existingUser) {
        console.log(`User ${id} already exists in database, skipping webhook creation`)
        return NextResponse.json({ message: 'User already exists, skipping webhook creation' }, { status: 200 })
      }
      
      // Only create user if they don't exist (self-registered users)
      await prisma.users.create({
        data: {
          clerkid: id,
          email: email_addresses[0].email_address,
          firstName: first_name || '',
          lastName: last_name || '',
        }
      })
      
      // Set role as USER for self-registered users
      await (await clerkClient()).users.updateUserMetadata(id, {
        publicMetadata: {
          role: Role.USER
        }
      })
      
      console.log(`User ${id} created successfully via webhook`)
    } catch (error) 
    {
      console.error('Error in UserCreated:', error)
      
      // Handle Prisma unique constraint errors
      if (error && typeof error === 'object' && 'code' in error) {
        const prismaError = error as { code: string; message: string };
        if (prismaError.code === 'P2002') {
          console.log(`User ${id} already exists in database (unique constraint)`)
          return NextResponse.json({ message: 'User already exists' }, { status: 200 })
        }
      }
      
      return NextResponse.json({ message: 'Error in UserCreated' }, { status: 500 })
    }
  return NextResponse.json({ message: 'User created successfully' }, { status: 200 })
}

const UserDeleted=async (id:string): Promise<NextResponse> => {
  try {
    const existingUser = await prisma.users.findUnique({
      where: { clerkid: id }
    })
    if (!existingUser) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 })
    }
    await prisma.users.delete({
      where: { clerkid: id }
    })
    return NextResponse.json({ message: 'User deleted successfully' }, { status: 200 })
  } 
  catch (error) {
    console.error('Error in UserDeleted:', error)
    return NextResponse.json({ message: 'Error in UserDeleted' }, { status: 500 })
  }

}




export async function POST(req: NextRequest) {
    try {
    const evt = await verifyWebhook(req)
   const user = evt.data as UserJSON
    if (!user.id) {
      return NextResponse.json({ message: 'User ID is required' }, { status: 400 })
    }

    const eventType = evt.type
    if (eventType === 'user.created') {
      return UserCreated(user)
    }

    if (eventType === 'user.deleted') {
      return UserDeleted(user.id)
    }


    return NextResponse.json({ message: 'Event type not supported' }, { status: 400 })
  } 
  catch (err) 
  {
    console.error('Error in SignUp webhook:', err)
    return NextResponse.json({ message: 'Error in SignUp webhook' }, { status: 400 })
  }
}
