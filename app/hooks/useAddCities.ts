
import { useSession } from 'next-auth/react';
import type { Session } from 'next-auth';

import { useMutation } from '@tanstack/react-query';

interface City {
  name: string;
}

const AddCities = async (cities: City[], supplierId: string) => {
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

export const useAddCities = () => {

  const { data: session } = useSession() as { data: Session | null; status: string };
  const supplierId = session?.user?.id;
  const mutation = useMutation({
    mutationFn: (cities: City[])=>AddCities(cities, supplierId as string),
  });
  return {
    mutation,
  };
};
