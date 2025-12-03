"use client"

import React from 'react';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface FormFieldProps {
  label: string;
  name: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => void;
  placeholder?: string;
  required?: boolean;
  error?: string;
  options?: { value: string; label: string }[];
  className?: string;
  autoComplete?: string;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function FormField({
  label,
  name,
  type = 'text',
  value,
  onChange,
  placeholder = '',
  required = true,
  error,
  options,
  className = '',
  autoComplete
}: FormFieldProps) {
  
  // ============================================================================
  // RENDER HELPERS
  // ============================================================================
  
  /**
   * Render input field
   */
  const renderInput = () => {
    const baseClasses = `w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
      error 
        ? 'border-red-500 focus:ring-red-500' 
        : 'border-gray-300 focus:ring-green-500'
    } ${className}`;

    if (type === 'select' && options) {
      return (
        <select
          name={name}
          value={value}
          onChange={onChange}
          className={baseClasses}
          required={required}
          autoComplete={autoComplete}
        >
          {options.map((option) => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      );
    }

    return (
      <input
        type={type}
        name={name}
        value={value}
        onChange={onChange}
        className={baseClasses}
        placeholder={placeholder}
        required={required}
        autoComplete={autoComplete}
      />
    );
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
  return (
    <div>
      <label className="block text-sm font-medium text-gray-700 mb-2">
        {label}
        {required && <span className="text-red-500 ml-1">*</span>}
      </label>
      
      {renderInput()}
      
      {error && (
        <p className="mt-1 text-sm text-red-600">{error}</p>
      )}
    </div>
  );
}
