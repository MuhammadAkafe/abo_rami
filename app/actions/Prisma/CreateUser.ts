import { prisma } from "@/lib/prisma"
import { NextResponse } from "next/server"

// This function is no longer used after removing Clerk
// Keeping it for backward compatibility but it won't be called
export const CreateUserPrisma=async (): Promise<NextResponse> => {
  return NextResponse.json({ message: 'This function is deprecated' }, { status: 200 })
}