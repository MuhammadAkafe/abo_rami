"use client"

import React from 'react';
import { NewSupplier } from '@/types/types';
import FormField from './FormField';
import CitySelector from './CitySelector';


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
      <div className="mt-4">
        <label className="block text-sm font-medium text-gray-700 mb-2">
          ערים <span className="text-red-500">*</span>
        </label>
        <CitySelector
          selectedCities={supplier.cities || []}
          onCityAdd={onCityAdd}
          onCityRemove={onCityRemove}
          disabled={isLoading}
          placeholder="בחר ערים או חפש... (חובה)"
          badgeColor="green"
          debounceMs={500}
        />
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
