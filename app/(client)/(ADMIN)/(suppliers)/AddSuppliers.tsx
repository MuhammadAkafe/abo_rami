"use client"
import React, { useState } from 'react';
import { Role } from '@prisma/client';
import { validateRegisterForm } from '@/app/validtion';
import { useMutation } from '@tanstack/react-query';
import { useRegister } from '@/app/(hooks)/useSupplier';


export default function AddSuppliers() {

  const [showAddForm, setShowAddForm] = useState(false);
  const [newSupplier, setNewSupplier] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as Role
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  
  const mutation = useRegister();

  const handle_change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewSupplier(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handle_submit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateRegisterForm(newSupplier);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    mutation.mutate(newSupplier,{
      onSuccess: () => {
        setShowAddForm(false);
      },
      onError: (error) => {
        console.error('Registration error:', error);
      }
    });
    setFieldErrors({});
  };



  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת ספקים</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors cursor-pointer"
        >
          {showAddForm ? 'ביטול' : 'הוסף ספק חדש'}
        </button>
      </div>

      {mutation.isSuccess && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">ההרשמה הושלמה בהצלחה!</p>
          </div>
        )}

        {/* Error Message */}
        {mutation.isError && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{mutation.error?.message || 'שגיאה בהרשמה'}</p>
          </div>
        )}
      {/* Add Customer Form */}
      {showAddForm && (
        <form onSubmit={handle_submit} className="bg-gray-50 rounded-lg p-6 mb-6"> 
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי</label>
              <input
                type="text"
                name="firstName"
                value={newSupplier.firstName}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.firstName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="הכנס שם פרטי"
              />
              {fieldErrors.firstName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם משפחה</label>
              <input
                type="text"
                name="lastName"
                value={newSupplier.lastName}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.lastName 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="הכנס שם משפחה"
              />
              {fieldErrors.lastName && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">אימייל</label>
              <input
                type="email"
                name="email"
                value={newSupplier.email}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.email 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="הכנס אימייל"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">טלפון</label>
              <input
                type="tel"
                name="phone"
                value={newSupplier.phone}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.phone 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="הכנס מספר טלפון"
              />
              {fieldErrors.phone && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">סיסמה</label>
              <input
                type="password"
                name="password"
                value={newSupplier.password}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.password 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="הכנס סיסמה"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>
            <div className="md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-2">אמות סיסמה</label>
              <input
                type="password"
                name="confirmPassword"
                value={newSupplier.confirmPassword}
                onChange={(e) => handle_change(e)}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.confirmPassword 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                placeholder="אמות סיסמה"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תפקיד</label>
              <select 
                name="role"
                value={newSupplier.role}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.role 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                onChange={(e) => handle_change(e)}
              >
                <option value="USER">ספק</option>
                <option value="ADMIN">מנהל</option>
              </select>
              {fieldErrors.role && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.role}</p>
              )}
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ביטול
            </button>
            <button
             type="submit"  
             disabled={mutation.isPending}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50 cursor-pointer"
            >
           {mutation.isPending ? 'מעבד...' : 'הוסף ספק'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
