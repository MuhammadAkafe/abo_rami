"use client"

import { useRouter } from 'next/navigation';
import { useQueryClient } from '@tanstack/react-query';
import EditCitiesForm from './EditCitiesForm';

interface EditCitiesClientProps {
  supplierId: string;
  currentCities: Array<{ id: string; city: string }>;
}

export default function EditCitiesClient({ supplierId, currentCities }: EditCitiesClientProps) {
  const router = useRouter();
  const queryClient = useQueryClient();

  const handleSuccess = () => {
    // Invalidate suppliers query to refresh supplier data in all components
    queryClient.invalidateQueries({ queryKey: ['suppliers'] });
    // Also invalidate the specific supplier query if it exists
    queryClient.invalidateQueries({ queryKey: ['supplier', supplierId] });
    // Refresh the page to show updated cities in the current page
    router.refresh();
  };

  return (
    <EditCitiesForm 
      supplierId={supplierId} 
      currentCities={currentCities}
      onSuccess={handleSuccess}
    />
  );
}


