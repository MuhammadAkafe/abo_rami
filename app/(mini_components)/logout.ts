import { signOut } from "next-auth/react";

export const logout = async (setIsLoading: (isLoading: boolean) => void) => {
    try {
      setIsLoading(true);
      await signOut( { callbackUrl: '/' });
    }
     catch (error) {
      console.error('Logout failed:', error);
    } finally {
      setIsLoading(false);
    }
  }