"use client"

import { useState, useRef, useEffect } from 'react';
import { UpdateSupplierCities } from '@/app/actions/UpdateSupplierCities';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { israel_cities as cities } from '@/components/israel_cities_names_and__geometric_data';

interface EditCitiesFormProps {
  supplierId: string;
  currentCities: Array<{ id: number; city: string }>;
  onSuccess?: () => void;
}

export default function EditCitiesForm({ supplierId, currentCities, onSuccess }: EditCitiesFormProps) {
  const [selectedCities, setSelectedCities] = useState<string[]>(
    currentCities.map(c => c.city)
  );
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search term
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (searchTerm.trim() === '') {
        setFilteredCities(cities);
      } else {
        const filtered = cities.filter(city =>
          city.name.toLowerCase().includes(searchTerm.toLowerCase())
        );
        setFilteredCities(filtered);
      }
    }, 300);

    return () => clearTimeout(timeoutId);
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsDropdownOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: { name: string }) => {
    if (!selectedCities.includes(city.name)) {
      setSelectedCities([...selectedCities, city.name]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleCityRemove = (city: string) => {
    setSelectedCities(selectedCities.filter(c => c !== city));
  };

  const handleInputClick = () => {
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Escape') {
      setIsDropdownOpen(false);
      setSearchTerm('');
    }
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
      {/* Selected Cities Display */}
      {selectedCities.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {selectedCities.map((city) => (
            <div
              key={city}
              className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-blue-100 text-blue-800 border border-blue-200"
            >
              <span className="mr-2">{city}</span>
              <button
                type="button"
                onClick={() => handleCityRemove(city)}
                className="text-blue-600 hover:text-blue-800 focus:outline-none"
                disabled={isSubmitting}
                title={`הסר ${city}`}
              >
                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>
          ))}
        </div>
      )}

      {/* City Selector */}
      <div className="relative" ref={dropdownRef}>
        <div className="relative">
          <input
            ref={inputRef}
            type="text"
            value={searchTerm}
            onChange={handleInputChange}
            onKeyDown={handleKeyDown}
            onClick={handleInputClick}
            placeholder="בחר ערים או חפש..."
            disabled={isSubmitting}
            className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent pr-10 text-right disabled:opacity-50 disabled:cursor-not-allowed"
            autoComplete="off"
          />
          
          {/* Dropdown arrow */}
          <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
            <svg
              className={`h-5 w-5 text-gray-400 transition-transform ${isDropdownOpen ? 'rotate-180' : ''}`}
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
            </svg>
          </div>
        </div>

        {/* Dropdown menu */}
        {isDropdownOpen && (
          <div 
            className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto"
            role="listbox"
          >
            {filteredCities.length === 0 ? (
              <div className="px-3 py-2 text-sm text-gray-500 text-center">
                לא נמצאו ערים
              </div>
            ) : (
              filteredCities
                .filter(city => !selectedCities.includes(city.name))
                .map((city, index) => (
                  <div
                    key={`${city.name}-${index}`}
                    onClick={() => handleCitySelect(city)}
                    onKeyDown={(e) => {
                      if (e.key === 'Enter' || e.key === ' ') {
                        e.preventDefault();
                        handleCitySelect(city);
                      }
                    }}
                    className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0"
                    tabIndex={0}
                    role="option"
                  >
                    <span className="text-right">{city.name}</span>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
      
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

