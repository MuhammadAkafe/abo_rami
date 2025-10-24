import { auth, currentUser } from '@clerk/nextjs/server'

/**
 * Get user role from Clerk's public metadata
 */
export async function getUserRole(): Promise<string | null> {
  try {
    const { userId } = await auth()
    
    if (!userId) {
      return null
    }

    // Get user data from Clerk
    const user = await currentUser()
    
    if (!user) {
      return null
    }

    // Get role from Clerk's public metadata
    const role = user.publicMetadata?.role as string
    
    return role || null
  } 
  catch (error) {
    console.error('Error getting user role:', error)
    return null
  }
}

