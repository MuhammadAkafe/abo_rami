"use client"

import React, { useState, useRef, useEffect } from 'react';
import { israel_cities as cities } from '@/app/components/israel_cities_names_and__geometric_data';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface City {
  name: string;
}

interface CitiesSelectorProps {
  selectedCities: City[];
  onCitiesChange: (cities: City[]) => void;
  label?: string;
  placeholder?: string;
  required?: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function CitiesSelector({
  selectedCities,
  onCitiesChange,
  label = "ערים (אופציונלי)",
  placeholder = "בחר ערים או חפש...",
  required = false
}: CitiesSelectorProps) {
  
  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const [filteredCities, setFilteredCities] = useState<City[]>(cities);
  
  // ============================================================================
  // REFS
  // ============================================================================
  
  const dropdownRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // ============================================================================
  // EFFECTS
  // ============================================================================
  
  /**
   * Filter cities based on search term
   */
  useEffect(() => {
    if (searchTerm.trim() === '') {
      setFilteredCities(cities);
    } else {
      const filtered = cities.filter(city =>
        city.name.toLowerCase().includes(searchTerm.toLowerCase())
      );
      setFilteredCities(filtered);
    }
  }, [searchTerm]);

  /**
   * Close dropdown when clicking outside
   */
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

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle city selection from dropdown
   */
  const handleCitySelect = (city: City) => {
    if (!selectedCities.some(selectedCity => selectedCity.name === city.name)) {
      onCitiesChange([...selectedCities, city]);
    }
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  /**
   * Handle removing a selected city
   */
  const handleRemoveCity = (cityToRemove: City) => {
    onCitiesChange(selectedCities.filter(city => city.name !== cityToRemove.name));
  };

  /**
   * Handle city input click to open dropdown
   */
  const handleCityInputClick = () => {
    setIsDropdownOpen(true);
    inputRef.current?.focus();
  };

  /**
   * Handle city search input change
   */
  const handleCitySearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value;
    setSearchTerm(value);
    setIsDropdownOpen(true);
  };

  /**
   * Clear all selected cities
   */
  const handleClearAllCities = () => {
    onCitiesChange([]);
    setSearchTerm('');
    setIsDropdownOpen(false);
  };

  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render selected cities as tags
   */
  const renderSelectedCities = () => {
    if (selectedCities.length === 0) return null;

    return (
      <div className="mb-3 flex flex-wrap gap-2">
        {selectedCities.map((city) => (
          <div
            key={city.name}
            className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
          >
            <span className="mr-2">{city.name}</span>
            <button
              type="button"
              onClick={() => handleRemoveCity(city)}
              className="text-green-600 hover:text-green-800 focus:outline-none"
              aria-label={`Remove ${city.name}`}
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>
        ))}
        {selectedCities.length > 0 && (
          <button
            type="button"
            onClick={handleClearAllCities}
            className="text-xs text-gray-500 hover:text-gray-700 underline"
          >
            נקה הכל
          </button>
        )}
      </div>
    );
  };

  /**
   * Render cities dropdown
   */
  const renderCitiesDropdown = () => {
    if (!isDropdownOpen) return null;

    const availableCities = filteredCities.filter(city => 
      !selectedCities.some(selected => selected.name === city.name)
    );

    return (
      <div className="absolute z-50 w-full mt-1 bg-white border border-gray-300 rounded-md shadow-lg max-h-60 overflow-auto">
        {availableCities.length === 0 ? (
          <div className="px-3 py-2 text-sm text-gray-500 text-center">
            לא נמצאו ערים
          </div>
        ) : (
          availableCities.map((city, index) => (
            <div
              key={`${city.name}-${index}`}
              onClick={() => handleCitySelect(city)}
              className="px-3 py-2 text-sm text-gray-900 hover:bg-gray-100 cursor-pointer flex justify-between items-center border-b border-gray-100 last:border-b-0"
            >
              <span className="text-right">{city.name}</span>
            </div>
          ))
        )}
      </div>
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div className="mt-6">
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {/* Selected Cities Display */}
      {renderSelectedCities()}

      {/* City Selector */}
      <div className="relative" ref={dropdownRef}>
        <input
          ref={inputRef}
          type="text"
          value={searchTerm}
          onChange={handleCitySearchChange}
          onClick={handleCityInputClick}
          placeholder={placeholder}
          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 text-right"
        />
        
        {/* Dropdown Arrow */}
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

        {/* Dropdown Menu */}
        {renderCitiesDropdown()}
      </div>
    </div>
  );
}
