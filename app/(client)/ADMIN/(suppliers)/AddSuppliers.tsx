"use client"

import React, { useState } from 'react';
import { Role } from '@prisma/client';
import { validateRegisterForm } from '@/app/validtion';
import { useAddSupplier } from '@/app/hooks/useAddSupplier';
import { useSession } from 'next-auth/react';
import { NewSupplier } from '@/app/(types)/types';
import SupplierForm from '@/app/components/SupplierForm';

// ============================================================================
// TYPES & INTERFACES
// ============================================================================


// ============================================================================
// MAIN COMPONENT
// ============================================================================

export default function AddSuppliers() {
  // ============================================================================
  // HOOKS & SESSION
  // ============================================================================
  
  const { data: session } = useSession();
  const user_id = session?.user && 'id' in session.user ? Number(session.user.id) : null;
  const mutation = useAddSupplier();

  // ============================================================================
  // STATE MANAGEMENT
  // ============================================================================
  
  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState<NewSupplier>({
    userid: null,
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: Role.USER
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================
  
  /**
   * Handle form input changes
   */
  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  /**
   * Reset form to initial state
   */
  const resetForm = () => {
    setNewSupplier({
      userid: null,
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      password: '',
      confirmPassword: '',
      role: Role.USER
    });
    setFieldErrors({});
  };

  /**
   * Handle form submission
   */
  const handleFormSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate form data
    const validation = validateRegisterForm(newSupplier);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    
    // Check if user is authenticated
    if (!user_id) {
      console.error('User not authenticated');
      return;
    }

    // Prepare submission data
    const submissionData = {
      ...newSupplier, 
      userid: user_id as number || null
    };

    // Submit data
    mutation.mutate(submissionData, {
      onSuccess: () => {
        setShowAddForm(false);
        resetForm();
      },
      onError: (error) => {
        console.error('Registration error:', error);
      }
    });
  };

  /**
   * Handle form cancel
   */
  const handleFormCancel = () => {
    setShowAddForm(false);
    resetForm();
  };

  // ============================================================================
  // MAIN RENDER
  // ============================================================================
  
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
          onSubmit={handleFormSubmit}
          onCancel={handleFormCancel}
        />
      )}
    </div>
  );
}