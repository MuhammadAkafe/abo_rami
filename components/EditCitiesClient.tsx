"use client"

import { useRouter } from 'next/navigation';
import EditCitiesForm from './EditCitiesForm';

interface EditCitiesClientProps {
  supplierId: string;
  currentCities: Array<{ id: number; city: string }>;
}

export default function EditCitiesClient({ supplierId, currentCities }: EditCitiesClientProps) {
  const router = useRouter();

  const handleSuccess = () => {
    // Refresh the page to show updated cities
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

