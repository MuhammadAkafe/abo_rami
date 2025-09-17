"use client"
import React, { useState, useRef, useEffect } from 'react';
import { israel_cities as cities } from '@/app/(mini_components)/israel_cities_names_and__geometric_data';

interface City {
  name: string;
  english_name: string;
  long: number;
  latt: number;
}



export default function CitiesSelector() {
  const [selectedCities, setSelectedCities] = useState<string[]>([]);
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(cities);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Filter cities based on search term
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        city.english_name.includes(searchTerm)
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
        setSearchTerm('');
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  const handleCitySelect = (city: City) => {
    if (!selectedCities.includes(city.name)) {
      setSelectedCities([...selectedCities, city.name]);
    }
    setSearchTerm('');
    setIsOpen(false);
  };

  const handleRemoveCity = (cityToRemove: string) => {
    setSelectedCities(selectedCities.filter(city => city !== cityToRemove));
  };

  const handleInputClick = () => {
    setIsOpen(true);
    inputRef.current?.focus();
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsOpen(true);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Escape') {
      setIsOpen(false);
      setSearchTerm('');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 py-12 px-4 sm:px-6 lg:px-8">
      <div className="max-w-md mx-auto">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center mb-8">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">בחירת ערים</h1>
            <p className="text-gray-600">בחר את הערים שלך מהרשימה</p>
          </div>

          <div className="space-y-6">
            {/* City Selector */}
            <div className="relative" ref={dropdownRef}>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                ערים
              </label>
              
              {/* Selected Cities Display */}
              {selectedCities.length > 0 && (
                <div className="mb-3 flex flex-wrap gap-2">
                  {selectedCities.map((city, index) => (
                    <div
                      key={index}
                      className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
                    >
                      <span className="mr-2">{city}</span>
                      <button
                        onClick={() => handleRemoveCity(city)}
                        className="text-green-600 hover:text-green-800 focus:outline-none"
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
                  onClick={handleInputClick}
                  onKeyDown={handleKeyDown}
                  placeholder="בחר ערים או חפש..."
                  className="w-full px-3 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 text-right"
                />
                
                {/* Dropdown arrow */}
                <div className="absolute inset-y-0 left-0 flex items-center pl-3 pointer-events-none">
                  <svg
                    className={`h-5 w-5 text-gray-400 transition-transform ${isOpen ? 'rotate-180' : ''}`}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                  </svg>
                </div>
              </div>

              {/* Dropdown menu */}
              {isOpen && (
                <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-lg shadow-lg max-h-60 overflow-auto">
                  {filteredCities.length === 0 ? (
                    <div className="px-3 py-2 text-sm text-gray-500 text-center">
                      לא נמצאו ערים
                    </div>
                  ) : (
                    filteredCities
                      .filter(city => !selectedCities.includes(city.name))
                      .map((city, index) => (
                        <div
                          key={index}
                          onClick={() => handleCitySelect(city)}
                          className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0"
                        >
                          <span className="text-right">{city.name}</span>
                          <span className="text-xs text-gray-500 text-left">{city.name}</span>
                        </div>
                      ))
                  )}
                </div>
              )}
            </div>

            {/* Selected Cities Summary */}
            {selectedCities.length > 0 && (
              <div className="bg-green-50 border border-green-200 rounded-lg p-4">
                <div className="flex items-center">
                  <div className="flex-shrink-0">
                    <svg className="h-5 w-5 text-green-400" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <div className="mr-3">
                    <h3 className="text-sm font-medium text-green-800">
                      הערים שנבחרו ({selectedCities.length}):
                    </h3>
                    <p className="text-sm text-green-700">
                      {selectedCities.join(', ')}
                    </p>
                  </div>
                </div>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex space-x-3 pt-4">
              <button
                onClick={() => {
                  setSelectedCities([]);
                  setSearchTerm('');
                  setIsOpen(false);
                }}
                className="flex-1 px-4 py-2 text-gray-600 border border-gray-300 rounded-lg hover:bg-gray-50 transition-colors"
              >
                נקה הכל
              </button>
              <button
                onClick={() => {
                  if (selectedCities.length > 0) {
                    alert(`הערים שנבחרו: ${selectedCities.join(', ')}`);
                  } else {
                    alert('אנא בחר לפחות עיר אחת');
                  }
                }}
                className="flex-1 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                אישור
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
