"use client"

import React, { useState } from 'react';
import { validateRegisterForm } from '@/app/client/validtion';
import { useAddSupplier } from '@/hooks/Admin/useAddSupplier';
import { NewSupplier } from '@/types/types';
import SupplierForm from '@/components/SupplierForm';
import { useUser } from '@clerk/nextjs';



export default function AddSuppliers() {

  const { user } = useUser();
  const { mutation } = useAddSupplier();
  const AdminId = user?.id as string;


  const [showAddForm, setShowAddForm] = useState(false);
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
    
 
    const validation = validateRegisterForm(newSupplier);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    
    // Check if user is authenticated
    if (!AdminId) {
      console.error('User not authenticated');
      return;
    }
    // Submit data
    mutation.mutate(newSupplier);
  };

  const handleFormCancel = () => {
    setShowAddForm(false);
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
      
      {/* Header Section */}
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת ספקים</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
        >
          {showAddForm ? 'ביטול' : 'הוסף ספק חדש'}
        </button>
      </div>

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
      {showAddForm && (
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
      )}
    </div>
  );
}