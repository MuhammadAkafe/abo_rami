import { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';
import { useRouter } from 'next/navigation';

interface City {
  name: string;
}

export const useCities = () => {
  const [isCheckingExistingCities, setIsCheckingExistingCities] = useState(true);
  const { data: session, status } = useSession() as { data: Session | null; status: string };
  const supplierId = session?.user?.id;
  const router = useRouter();

  // Check for existing cities and redirect if found
  useEffect(() => {
    // Only proceed if session is loaded and user is authenticated
    if (status === 'loading') {
      return; // Still loading session
    }
    
    if (status === 'unauthenticated' || !supplierId) {
      setIsCheckingExistingCities(false);
      return;
    }

    const fetchExistingCities = async () => {
      try {
        const response = await fetch(`/api/GetAllCities?supplier_id=${supplierId}`);
        const data = await response.json();
        
        if (response.ok && data.length > 0) {
          // Redirect to Loading page to perform proper checks if cities exist
          router.push('/Loading');
          return;
        }
      } catch (error) {
        console.error('Error fetching existing cities:', error);
      } finally {
        setIsCheckingExistingCities(false);
      }
    };
    
    fetchExistingCities();
  }, [supplierId, router, status]);

  const addCities = async (cities: City[]) => {
    if (!supplierId) {
      throw new Error('Supplier ID is required');
    }

    const response = await fetch('/api/Supplier/AddCites', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ 
        cities, 
        supplier_id: supplierId 
      }),
    });
    
    const data = await response.json();
    
    if (!response.ok) {
      throw new Error(data.error || 'Failed to add cities');
    }
    
    return data;
  };

  return {
    isCheckingExistingCities,
    supplierId,
    addCities,
    sessionStatus: status
  };
};
