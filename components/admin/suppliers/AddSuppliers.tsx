"use client"

import React, { useState } from 'react';
import { AddSupplierFormValidation } from '@/components/packages/validtion';
import { useAddSupplier } from '@/hooks/Admin/useAddSupplier';
import { NewSupplier } from '@/types/types';
import SupplierForm from '@/components/admin/suppliers/SupplierForm';



export default function AddSuppliers() {

  const { mutation } = useAddSupplier();

  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    cities: [],
  });


  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const resetForm = () => {
    setNewSupplier({
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      cities: [],
    });
    setFieldErrors({});
  };


  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
 
    const validation = AddSupplierFormValidation(newSupplier);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    
    // Submit data
    mutation.mutate(newSupplier);
  };

  const handleFormCancel = () => {
    resetForm();
  };

  const handleCityAdd = (city: string) => {
    setNewSupplier(prev => ({
      ...prev,
      cities: [...prev.cities, city]
    }));
  };

  const handleCityRemove = (city: string) => {
    setNewSupplier(prev => ({
      ...prev,
      cities: prev.cities.filter(c => c !== city)
    }));
  };


  
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      


      {/* Success Message */}
      {mutation.isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center mb-6">
          <p className="font-medium">ההרשמה הושלמה בהצלחה!</p>
        </div>
      )}

      {/* Error Message */}
      {mutation.isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-6">
          <p className="font-medium">{mutation.error?.message || 'שגיאה בהרשמה'}</p>
        </div>
      )}

      {/* Add Supplier Form */}
        <SupplierForm
          supplier={newSupplier}
          fieldErrors={fieldErrors}
          isLoading={mutation.isPending}
          onSupplierChange={handleFormInputChange}
          onCityAdd={handleCityAdd}
          onCityRemove={handleCityRemove}
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      
    </div>
  );
}