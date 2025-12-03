"use client"

import { useState, useRef, useEffect } from 'react';
import { israel_cities as cities } from '@/components/packages/israel_cities_names_and__geometric_data';

interface CitySelectorProps {
  selectedCities: string[];
  onCityAdd: (city: string) => void;
  onCityRemove: (city: string) => void;
  disabled?: boolean;
  placeholder?: string;
  badgeColor?: 'blue' | 'green';
  debounceMs?: number;
}

export default function CitySelector({
  selectedCities,
  onCityAdd,
  onCityRemove,
  disabled = false,
  placeholder = "בחר ערים או חפש...",
  badgeColor = 'blue',
  debounceMs = 300
}: CitySelectorProps) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState(cities);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

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
    }, debounceMs);

    return () => clearTimeout(timeoutId);
  }, [searchTerm, debounceMs]);

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
      onCityAdd(city.name);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
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

  const badgeClasses = badgeColor === 'blue' 
    ? 'bg-blue-100 text-blue-800 border-blue-200'
    : 'bg-green-100 text-green-800 border-green-200';

  const badgeButtonClasses = badgeColor === 'blue'
    ? 'text-blue-600 hover:text-blue-800'
    : 'text-green-600 hover:text-green-800';

  const focusRingClasses = badgeColor === 'blue'
    ? 'focus:ring-blue-500'
    : 'focus:ring-green-500';

  return (
    <div>
      {/* Selected Cities Display */}
      {selectedCities.length > 0 && (
        <div className="mb-3 flex flex-wrap gap-2">
          {selectedCities.map((city) => (
            <div
              key={city}
              className={`inline-flex items-center px-3 py-1 rounded-full text-sm border ${badgeClasses}`}
            >
              <span className="mr-2">{city}</span>
              <button
                type="button"
                onClick={() => onCityRemove(city)}
                className={`${badgeButtonClasses} focus:outline-none`}
                disabled={disabled}
                title={`הסר ${city}`}
                aria-label={`הסר ${city}`}
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
            placeholder={placeholder}
            disabled={disabled}
            className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${focusRingClasses} focus:border-transparent pr-10 text-right disabled:opacity-50 disabled:cursor-not-allowed`}
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
            aria-label="רשימת ערים"
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
                    className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0 focus:outline-none focus:bg-gray-100"
                    tabIndex={0}
                    role="option"
                    aria-selected={false}
                  >
                    <span className="text-right">{city.name}</span>
                  </div>
                ))
            )}
          </div>
        )}
      </div>
    </div>
  );
}

