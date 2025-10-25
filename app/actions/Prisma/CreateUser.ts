import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

import { UserJSON } from "@clerk/nextjs/server"


export const CreateUserPrisma=async (user:UserJSON): Promise<NextResponse> => {

  const { id } = user
  const email = user.email_addresses[0].email_address
  const firstName = user.first_name
  const lastName = user.last_name
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
            email: email,
            firstName: firstName || '',
            lastName: lastName || '',
          }
        })
        return NextResponse.json({ message: 'User created successfully in Prisma' }, { status: 200 })
      } 
      catch (error) 
      {
        // Handle Prisma unique constraint errors
        if (error && typeof error === 'object' && 'code' in error) {
          const prismaError = error as { code: string; message: string };
          if (prismaError.code === 'P2002') {
            console.log(`User ${id} already exists in database (unique constraint)`)
            return NextResponse.json({ message: 'User already exists' }, { status: 200 })
          }
        }
        return NextResponse.json({ message: 'Error in CreateUserInPrisma' }, { status: 500 })
      }
  }