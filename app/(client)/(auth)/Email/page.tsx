"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import BackUpBtn from "@/app/components/backUpBtn";
import { useMutation } from "@tanstack/react-query";
import { validateEmailForm, type EmailFormData } from "@/app/validtion";
import LoadingButton from "@/app/components/Loading/loadingButton";

const sendEmail = async (formData: EmailFormData) => {
  try {
    const response = await fetch('/api/email', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Email sending error:', error);
    throw error;
  }
};


function EmailPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<EmailFormData>({
    email: '',
    isAdmin: false
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);

  const mutation = useMutation({ 
    mutationFn: sendEmail,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };


  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setSuccess(null);
    setErrors({});
    setFieldErrors({});
    const validation = validateEmailForm(formData);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      return;
    }
    
    mutation.mutate(formData, {
      onSuccess: () => {
        setSuccess('קוד אימות נשלח לכתובת האימייל שלכם');
        // Store email and user type for next step
        localStorage.setItem('resetEmail', formData.email);
        localStorage.setItem('isAdmin', formData.isAdmin.toString());
        // Navigate to code verification page immediately
        router.push('/code');
      },
      onError: (error: Error) => {
        console.error('Email sending error:', error);
        const errorMessage = error.message || 'שגיאה בשליחת האימייל. אנא נסו שוב.';
        setErrors({ general: errorMessage });
      },
    });

  };






  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Back Button - Top Middle */}
      <BackUpBtn />
      
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            שחזור סיסמה
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הזינו את כתובת האימייל שלכם לקבלת קוד אימות
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{success}</p>
          </div>
        )}

        {/* Error Message */}
        {errors.general && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{errors.general}</p>
          </div>
        )}

        {/* Email Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir="rtl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* User Type Selection */}
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                סוג משתמש
              </label>
              <div className="flex space-x-4 space-x-reverse">
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isAdmin"
                    value="false"
                    checked={!formData.isAdmin}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.value === 'true' }))}
                    className="mr-2"
                  />
                  ספק
                </label>
                <label className="flex items-center">
                  <input
                    type="radio"
                    name="isAdmin"
                    value="true"
                    checked={formData.isAdmin}
                    onChange={(e) => setFormData(prev => ({ ...prev, isAdmin: e.target.value === 'true' }))}
                    className="mr-2"
                  />
                  מנהל
                </label>
              </div>
            </div>

            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                value={formData.email}
                onChange={handleInputChange}
                autoComplete="email"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="הזינו את כתובת האימייל שלכם"
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Submit Button */}
            <LoadingButton loading={mutation.isPending} text="שלח קוד אימות" />
          </form>

        </div>
      </div>
    </div>
  );
}

export default React.memo(EmailPage);
