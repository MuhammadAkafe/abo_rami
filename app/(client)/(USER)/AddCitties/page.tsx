"use client"
import React, { useState, useRef, useEffect } from 'react';
import { israel_cities as cities } from '@/app/components/israel_cities_names_and__geometric_data';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import LoadingButton from '@/app/components/loadingButton';
import LoadingComponent from '@/app/components/LoadingCompoenent';
import ErrorAlert from '@/app/components/ErrorAlert';
import { useCities } from '@/app/hooks/useCities';
import { Role } from '@prisma/client';

interface City {
  name: string;
}

export default function CitiesSelector() {
  // State management
  const [selectedCities, setSelectedCities] = useState<City[]>([]);
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(cities);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  
  // Refs
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  // Custom hooks
  const { isCheckingExistingCities, addCities, sessionStatus } = useCities();
  const { data: session } = useSession();
  const router = useRouter();

  // Session validation - redirect if not authenticated or wrong role
  useEffect(() => {
    if (sessionStatus === 'loading') return; // Still loading session
    
    if (sessionStatus === 'unauthenticated') {
      router.push('/Login');
      return;
    }
    
    if (session?.user && 'role' in session.user && session.user.role !== Role.USER) {
      router.push('/Login');
      return;
    }
  }, [session, sessionStatus, router]);

  // Filter cities based on search term with debouncing
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
    }, 300); // 300ms debounce

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

  // Show loading component while checking session or existing cities
  // Always show loading until all checks are complete
  if (sessionStatus === 'loading' || isCheckingExistingCities) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <LoadingComponent isLoading={true} />
      </div>
    );
  }

  // If session is not authenticated or wrong role, show loading while redirecting
  if (sessionStatus === 'unauthenticated' || (session?.user && 'role' in session.user && session.user.role !== Role.USER)) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
        <LoadingComponent isLoading={true} />
      </div>
    );
  }









  // Event handlers
  const handleCitySelect = (city: City) => {
    if (!selectedCities.some(selectedCity => selectedCity.name === city.name)) {
      setSelectedCities(prev => [...prev, city]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleRemoveCity = (cityToRemove: City) => {
    setSelectedCities(prev => prev.filter(city => city.name !== cityToRemove.name));
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

  const handleClearAll = () => {
    setSelectedCities([]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError(null);
    
    if (selectedCities.length === 0) {
      setError('אנא בחר לפחות עיר אחת');
      return;
    }

    setIsLoading(true);
    try {
      await addCities(selectedCities);
      // Success - redirect to TaskList
      router.push('/Tasklist');
    } catch (error) {
      console.error('Error submitting cities:', error);
      setError(error instanceof Error ? error.message : 'שגיאה בהוספת הערים');
    } finally {
      setIsLoading(false);
    }
  };


  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">בחירת ערים</h1>
            <p className="text-gray-600">בחר את הערים שלך מהרשימה</p>
          </div>

          {/* Error Alert */}
          {error && (
            <ErrorAlert 
              message={error} 
              onClose={() => setError(null)} 
            />
          )}

          <div className="space-y-6">
            {/* City Selector */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ערים
              </label>
              
              {/* Selected Cities Display */}
              {selectedCities.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedCities.map((city) => (
                    <div
                      key={city.name}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                    >
                      <span className="mr-2">{city.name}</span>
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="text-green-600 hover:text-green-800 focus:outline-none"
                        disabled={isLoading}
                        title={`הסר ${city.name}`}
                        aria-label={`הסר ${city.name}`}
                      >
                        <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    </div>
                  ))}
                </div>
              )}

              <div className="relative">
                <input
                  ref={inputRef}
                  type="text"
                  value={searchTerm}
                  onChange={handleInputChange}
                  onKeyDown={handleKeyDown}
                  onClick={handleInputClick}
                  placeholder="בחר ערים או חפש..."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 text-right"
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
                  className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto"
                  role="listbox"
                  aria-label="רשימת ערים"
                >
                  {filteredCities.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      לא נמצאו ערים
                    </div>
                  ) : (
                    filteredCities
                      .filter(city => !selectedCities.some(selected => selected.name === city.name))
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
                          className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
                          tabIndex={0}
                          role="option"
                          aria-selected={false}
                        >
                          <span className="text-right">{city.name}</span>
                          <span className="text-xs text-gray-500 text-left">{city.name}</span>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>


            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={handleClearAll}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
                disabled={isLoading}
              >
                נקה הכל
              </button>
              <LoadingButton 
                loading={isLoading} 
                text="אישור" 
                handleClick={handleSubmit}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
