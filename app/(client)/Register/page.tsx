"use client"

import Link from "next/link";
import { useTransition, useState } from "react";
import { useError } from "@/app/(hooks)/useError";
import { validateRegisterForm } from "@/app/validtion";
import { Role } from "@/generated/prisma";

export default function RegisterPage() {
  const [pending, startTransition] = useTransition();
  const { setError, setSuccess, success, error } = useError();
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    phone: '',
    password: '',
    confirmPassword: '',
    role: 'USER' as Role
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
    // Clear field error when user starts typing
    if (fieldErrors[name]) {
      setFieldErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const validation = validateRegisterForm(formData);
    if (!validation.success) {
      setFieldErrors(validation.errors);
      setError('אנא תקנו את השגיאות בטופס');
      return;
    }
    setFieldErrors({});
    setError(null);
    setSuccess(false);
    startTransition(async () => {
      try {
        const response = await fetch('/register', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(formData),
        });
        if (response.ok) {
          setSuccess(true);
          setError(null);
          setTimeout(() => {
            window.location.href = '/Login';
          }, 500);
        }
         else {
          const errorData = await response.json();
          setError(errorData.message || 'Registration failed');
          setSuccess(false);
        }
      } catch {
        setError('שגיאה בחיבור לשרת');
      }
    });
  };


  






  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 to-pink-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
            צרו את החשבון שלכם
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הצטרפו אלינו היום והתחילו
          </p>
        </div>

        {/* Success Message */}
        {success && (
          <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">ההרשמה הושלמה בהצלחה!</p>
            <p className="text-sm">אתם מועברים לעמוד ההתחברות...</p>
          </div>
        )}

        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Register Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir="rtl">
            <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Name Fields */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-2">
                  שם פרטי
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  value={formData.firstName}
                  onChange={handleInputChange}
                  autoComplete="given-name"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.firstName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={pending}
                  placeholder="שם פרטי"
                />
                {fieldErrors.firstName && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.firstName}</p>
                )}
              </div>
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-2">
                  שם משפחה
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  value={formData.lastName}
                  onChange={handleInputChange}
                  type="text"
                  autoComplete="family-name"
                  required
                  className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                    fieldErrors.lastName ? 'border-red-500' : 'border-gray-300'
                  }`}
                  disabled={pending}
                  placeholder="שם משפחה"
                />
                 {fieldErrors.lastName && (
                    <p className="mt-1 text-sm text-red-600">{fieldErrors.lastName}</p>
                  )}
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
                value={formData.email}
                onChange={handleInputChange}
                type="email"
                autoComplete="email"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 disabled:opacity-50 disabled:cursor-not-allowed ${
                  fieldErrors.email ? 'border-red-500' : 'border-gray-300'
                }`}
                disabled={pending}
                placeholder="yohanan@example.com"
                maxLength={100}
              />
              {fieldErrors.email && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.email}</p>
              )}
            </div>

            {/* Phone Field */}
            <div>
              <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-2">
                מספר טלפון
              </label>
              <input
                id="phone"
                name="phone"
                value={formData.phone}
                onChange={handleInputChange}
                type="tel"
                autoComplete="tel"
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.phone ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="0501234567"
              />
                {fieldErrors.phone && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.phone}</p>
                )}
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <input
                id="password"
                name="password"
                value={formData.password}
                onChange={handleInputChange}
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="צרו סיסמה חזקה"
              />
              {fieldErrors.password && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
                )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                אשרו סיסמה
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                type="password"
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="אשרו את הסיסמה שלכם"
              />
                {fieldErrors.confirmPassword && (
                  <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
                )}
            </div>


            {/* Submit Button */}
            <button
              type="submit"
              disabled={pending}
              className="w-full flex justify-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-purple-600 hover:bg-purple-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none"
            >
              {pending ? (
                <div className="flex items-center">
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  מעבד...
                </div>
              ) : (
                'צרו חשבון'
              )}
            </button>
          </form>




          {/* Sign In Link */}
          <div className="text-center">
            <p className="text-sm text-gray-600">
              יש לכם כבר חשבון?{" "}
              <Link href="/Login" className="font-medium text-purple-600 hover:text-purple-500 transition-colors">
                התחברו
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
