"use client"
import React, { useState } from 'react';
import { Role } from '@/generated/prisma/client';
import { useError } from '@/app/(hooks)/useError';
import { validateRegisterForm } from '@/app/validtion';


export default function AddCustomer() {

  const [showAddForm, setShowAddForm] = useState(false);
  const { setError, setSuccess, loading, setLoading, error, success } = useError();
  const [newCustomer, setNewCustomer] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as Role
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handle_change = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setNewCustomer(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handle_submit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateRegisterForm(newCustomer);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      setError('אנא תקנו את השגיאות בטופס');
      return;
    }
    setFieldErrors({});
    setError(null);
    setSuccess(false);
    setLoading(true);
    try {
      const response = await fetch('/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newCustomer),
      });
      if (response.ok) {
        setSuccess(true);
        setError(null);
        setNewCustomer({
          firstName: '',
          lastName: '',
          email: '',
          phone: '',
          password: '',
          confirmPassword: '',
          role: 'USER' as Role
        });
        setShowAddForm(false);
      } else {
        const errorData = await response.json();
        setError(errorData.message || 'Registration failed');
        setSuccess(false);
      }
    } catch {
      setError('שגיאה בחיבור לשרת');
    } finally {
      setLoading(false);
    }
  };



  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת לקוחות</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-green-600 text-white px-4 py-2 rounded-md hover:bg-green-700 transition-colors"
        >
          {showAddForm ? 'ביטול' : 'הוסף לקוח חדש'}
        </button>
      </div>

      {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">ההרשמה הושלמה בהצלחה!</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}
      {/* Add Customer Form */}
      {showAddForm && (
        <form onSubmit={handle_submit} className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף לקוח חדש</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם פרטי</label>
              <input
                type="text"
                name="firstName"
                value={newCustomer.firstName}
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
                value={newCustomer.lastName}
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
                value={newCustomer.email}
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
                value={newCustomer.phone}
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
                value={newCustomer.password}
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
                value={newCustomer.confirmPassword}
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
                value={newCustomer.role}
                className={`w-full px-3 py-2 border rounded-md focus:outline-none focus:ring-2 ${
                  fieldErrors.role 
                    ? 'border-red-500 focus:ring-red-500' 
                    : 'border-gray-300 focus:ring-green-500'
                }`}
                onChange={(e) => handle_change(e)}
              >
                <option value="USER">לקוח</option>
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
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
             type="submit"  
             disabled={loading}
              className="px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors disabled:opacity-50"
            >
           {loading ? 'מעבד...' : 'הוסף לקוח'}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}
