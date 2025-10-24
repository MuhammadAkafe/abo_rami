"use client"

import React, { useState, useRef, useEffect } from 'react';
import { NewSupplier } from '@/types/types';
import FormField from './FormField';
import { israel_cities as cities } from '@/components/israel_cities_names_and__geometric_data';


interface SupplierFormProps {
  supplier: NewSupplier;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  onSupplierChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onCityAdd: (city: string) => void;
  onCityRemove: (city: string) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}



export default function SupplierForm({
  supplier,
  fieldErrors,
  isLoading,
  onSupplierChange,
  onCityAdd,
  onCityRemove,
  onSubmit,
  onCancel
}: SupplierFormProps) {
  
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
    }, 500); // 300ms debounce

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
    if (!supplier.cities || !supplier.cities.includes(city.name)) {
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


  
  return (
    <form onSubmit={onSubmit} className="bg-gray-50 rounded-lg p-6 mb-6"> 
      
      {/* Basic Information Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <FormField
          label="שם פרטי"
          name="firstName"
          type="text"
          value={supplier.firstName}
          onChange={onSupplierChange}
          placeholder="הכנס שם פרטי"
          error={fieldErrors.firstName}
          autoComplete="given-name"
        />
        
        <FormField
          label="שם משפחה"
          name="lastName"
          type="text"
          value={supplier.lastName}
          onChange={onSupplierChange}
          placeholder="הכנס שם משפחה"
          error={fieldErrors.lastName}
          autoComplete="family-name"
        />
        
        <FormField
          label="אימייל"
          name="email"
          type="email"
          value={supplier.email}
          onChange={onSupplierChange}
          placeholder="הכנס אימייל"
          error={fieldErrors.email}
          autoComplete="email"
        />
        
        <FormField
          label="טלפון"
          name="phone"
          type="tel"
          value={supplier.phone}
          onChange={onSupplierChange}
          placeholder="הכנס מספר טלפון"
          error={fieldErrors.phone}
          autoComplete="tel"
        />
      </div>

      {/* Password Fields */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-4">
        <FormField
          label="סיסמה"
          name="password"
          type="password"
          value={supplier.password}
          onChange={onSupplierChange}
          placeholder="הכנס סיסמה"
          error={fieldErrors.password}
          autoComplete="new-password"
        />
        
        <FormField
          label="אמות סיסמה"
          name="confirmPassword"
          type="password"
          value={supplier.confirmPassword}
          onChange={onSupplierChange}
          placeholder="אמות סיסמה"
          error={fieldErrors.confirmPassword}
          autoComplete="new-password"
        />
      </div>

      {/* City Selection */}
      <div className="mt-4" >
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ערים <span className="text-red-500">*</span>
        </label>
        
        {/* Selected Cities Display */}
        {supplier.cities && supplier.cities.length > 0 && (
          <div className="mb-3 flex flex-wrap gap-2">
            {supplier.cities.map((city) => (
              <div
                key={city}
                className="inline-flex items-center px-3 py-1 rounded-full text-sm bg-green-100 text-green-800 border border-green-200"
              >
                <span className="mr-2">{city}</span>
                <button
                  type="button"
                  onClick={() => onCityRemove(city)}
                  className="text-green-600 hover:text-green-800 focus:outline-none"
                  disabled={isLoading}
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
              placeholder="בחר ערים או חפש... (חובה)"
              disabled={isLoading}
              className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 focus:ring-green-500 focus:border-transparent pr-10 text-right disabled:opacity-50 disabled:cursor-not-allowed `}
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
                  .filter(city => !supplier.cities || !supplier.cities.includes(city.name))
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




      
      {/* Form Actions */}
      <div className="mt-6 flex justify-end space-x-3">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
        >
          ביטול
        </button>
        <button
          type="submit"  
          disabled={isLoading || (supplier.cities && supplier.cities.length === 0)}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'מעבד...' : 'הוסף ספק'}
        </button>
      </div>
    </form>
  );
}
