import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

interface ExtendedUser {
  id: number;
  role: string;
  name?: string | null;
  email?: string | null;
  image?: string | null;
}

export const usePostLoginChecks = () => {
  const [loadingMessage, setLoadingMessage] = useState('בודק פרטי משתמש...');
  const [isChecking, setIsChecking] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  // Extract user data for cleaner dependency tracking
  const user = session?.user as ExtendedUser | undefined;
  const userRole = user?.role;
  const userId = user?.id;

  const performChecks = useCallback(async () => {
    try {
      setIsChecking(true);

      // Check user role
      if (userRole !== Role.USER) {
        setLoadingMessage('מפנה לממשק המתאים...');
        router.push('/Login');
        return;
      }

      // Check if user has cities in database
      setLoadingMessage('בודק ערים קיימות...');
      const response = await fetch(`/api/GetAllCities?supplier_id=${userId}`);
      const citiesData = await response.json();

      if (response.ok && citiesData.length > 0) {
        // User has cities, redirect to TaskList
        setLoadingMessage('מפנה לרשימת משימות...');
        router.push('/Tasklist');
      } else {
        // User doesn't have cities, redirect to AddCities
        setLoadingMessage('מפנה לבחירת ערים...');
        router.push('/AddCitties');
      }
    } catch (error) 
    {
      console.error('Error during post-login checks:', error);
      setLoadingMessage('שגיאה בטעינה...');
      // Fallback to AddCities page
      setTimeout(() => {
        router.push('/AddCitties');
      }, 2000);
    } finally 
    {
      setIsChecking(false);
    }
  }, [userRole, userId, router]);

  useEffect(() => {
    if (status === 'loading') {
      setLoadingMessage('טוען פרטי משתמש...');
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/Login');
      return;
    }

    if (user) {
      performChecks();
    }
  }, [user, status, router, performChecks]);

  return {
    loadingMessage,
    isChecking,
    session,
    status
  };
};
