"use client"

import React from 'react';
import { Role } from '@prisma/client';
import { NewSupplier } from '@/types/types';
import FormField from './FormField';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================


interface SupplierFormProps {
  supplier: NewSupplier;
  fieldErrors: Record<string, string>;
  isLoading: boolean;
  onSupplierChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  onSubmit: (e: React.FormEvent<HTMLFormElement>) => void;
  onCancel: () => void;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function SupplierForm({
  supplier,
  fieldErrors,
  isLoading,
  onSupplierChange,
  onSubmit,
  onCancel
}: SupplierFormProps) {
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Get role options for select field
   */
  const getRoleOptions = () => [
    { value: Role.USER, label: 'ספק' }
  ];

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
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
        />
        
        <FormField
          label="שם משפחה"
          name="lastName"
          type="text"
          value={supplier.lastName}
          onChange={onSupplierChange}
          placeholder="הכנס שם משפחה"
          error={fieldErrors.lastName}
        />
        
        <FormField
          label="אימייל"
          name="email"
          type="email"
          value={supplier.email}
          onChange={onSupplierChange}
          placeholder="הכנס אימייל"
          error={fieldErrors.email}
        />
        
        <FormField
          label="טלפון"
          name="phone"
          type="tel"
          value={supplier.phone}
          onChange={onSupplierChange}
          placeholder="הכנס מספר טלפון"
          error={fieldErrors.phone}
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
        />
        
        <FormField
          label="אמות סיסמה"
          name="confirmPassword"
          type="password"
          value={supplier.confirmPassword}
          onChange={onSupplierChange}
          placeholder="אמות סיסמה"
          error={fieldErrors.confirmPassword}
        />
      </div>

      {/* Role Selection */}
      <div className="mt-4">
        <FormField
          label="תפקיד"
          name="role"
          type="select"
          value={supplier.role}
          onChange={onSupplierChange}
          options={getRoleOptions()}
          error={fieldErrors.role}
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
          disabled={isLoading}
          className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
        >
          {isLoading ? 'מעבד...' : 'הוסף ספק'}
        </button>
      </div>
    </form>
  );
}
