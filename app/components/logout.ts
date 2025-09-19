import { signOut } from "next-auth/react";

export interface LogoutProps {
  setIsLoading: (isLoading: boolean) => void;
}

export const logout = async ({setIsLoading}: LogoutProps) => {
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