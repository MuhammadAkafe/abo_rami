"use client"

import { useState } from 'react';
import { UpdateSupplierCities } from '@/app/actions/UpdateSupplierCities';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import CitySelector from './CitySelector';

interface EditCitiesFormProps {
  supplierId: string;
  currentCities: Array<{ id: number; city: string }>;
  onSuccess?: () => void;
}

export default function EditCitiesForm({ supplierId, currentCities, onSuccess }: EditCitiesFormProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(
    currentCities.map(c => c.city)
  );
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleCityAdd = (city: string) => {
    if (!selectedCities.includes(city)) {
      setSelectedCities([...selectedCities, city]);
    }
  };

  const handleCityRemove = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (selectedCities.length === 0) {
      toast.error('יש לבחור לפחות עיר אחת', {
        position: 'top-left',
        rtl: true,
      });
      return;
    }

    setIsSubmitting(true);
    
    try {
      const result = await UpdateSupplierCities(supplierId, selectedCities);
      
      if (result.success) {
        toast.success('הערים עודכנו בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
        if (onSuccess) {
          onSuccess();
        }
      } else {
        toast.error(result.error || 'שגיאה בעדכון הערים', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      toast.error('שגיאה בעדכון הערים', {
        position: 'top-left',
        rtl: true,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <CitySelector
        selectedCities={selectedCities}
        onCityAdd={handleCityAdd}
        onCityRemove={handleCityRemove}
        disabled={isSubmitting}
        placeholder="בחר ערים או חפש..."
        badgeColor="blue"
        debounceMs={300}
      />
      
      <button
        type="submit"
        disabled={isSubmitting || selectedCities.length === 0}
        className="w-full bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
      >
        {isSubmitting ? 'מעדכן...' : 'עדכן ערים'}
      </button>
    </form>
  );
}


