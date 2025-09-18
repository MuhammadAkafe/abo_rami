import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { Role } from '@prisma/client';

export const usePostLoginChecks = () => {
  const [loadingMessage, setLoadingMessage] = useState('בודק פרטי משתמש...');
  const [isChecking, setIsChecking] = useState(true);
  const { data: session, status } = useSession();
  const router = useRouter();

  useEffect(() => {
    if (status === 'loading') {
      setLoadingMessage('טוען פרטי משתמש...');
      return;
    }

    if (status === 'unauthenticated') {
      router.push('/Login');
      return;
    }

    if (session?.user) {
      performChecks();
    }
  }, [session, status, router]);

  const performChecks = async () => {
    try {
      setIsChecking(true);

      // Check user role
      if (session?.user?.role !== Role.USER) {
        setLoadingMessage('מפנה לממשק המתאים...');
        router.push('/Login');
        return;
      }

      // Check if user has cities in database
      setLoadingMessage('בודק ערים קיימות...');
      const response = await fetch(`/api/GetAllCitiess?supplier_id=${session.user.id}`);
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
    } catch (error) {
      console.error('Error during post-login checks:', error);
      setLoadingMessage('שגיאה בטעינה...');
      // Fallback to AddCities page
      setTimeout(() => {
        router.push('/AddCitties');
      }, 2000);
    } finally {
      setIsChecking(false);
    }
  };

  return {
    loadingMessage,
    isChecking,
    session,
    status
  };
};
