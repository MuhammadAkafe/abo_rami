"use client"
import Link from "next/link";
import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";
import React from "react";
import BackUpBtn from "@/app/components/backUpBtn";
import { useMutation } from "@tanstack/react-query";
import LoadingButton from "@/app/components/Loading/loadingButton";

// ============================================================================
// TYPES & INTERFACES
// ============================================================================

interface ForgotPasswordFormData {
  password: string;
  confirmPassword: string;
}

interface ResetPasswordData {
  email: string;
  newPassword: string;
  resetToken: string;
  isAdmin: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// API function
const resetPassword = async (data: ResetPasswordData) => {
  try {
    const response = await fetch('/api/reset-password', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(data),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || `HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  } catch (error) {
    console.error('Password reset error:', error);
    throw error;
  }
};

function ForgotPasswordPage() {
  const router = useRouter();
  const [formData, setFormData] = useState<ForgotPasswordFormData>({
    password: '',
    confirmPassword: ''
  });
  const [fieldErrors, setFieldErrors] = useState<Record<string, string>>({});
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const [resetToken, setResetToken] = useState<string>('');

  // Get stored data
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    const storedResetToken = localStorage.getItem('resetToken');
    if (!storedEmail || !storedResetToken) {
      router.push('/Email');
      return;
    }

    setEmail(storedEmail);
    setIsAdmin(storedIsAdmin === 'true');
    setResetToken(storedResetToken);
  }, [router]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Mutation
  const resetMutation = useMutation({
    mutationFn: resetPassword,
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

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Password validation
    if (!formData.password) {
      newErrors.password = 'סיסמה נדרשת';
    } else if (formData.password.length < 6) {
      newErrors.password = 'סיסמה חייבת להכיל לפחות 6 תווים';
    }

    // Confirm password validation
    if (!formData.confirmPassword) {
      newErrors.confirmPassword = 'אישור סיסמה נדרש';
    } else if (formData.password !== formData.confirmPassword) {
      newErrors.confirmPassword = 'הסיסמאות אינן תואמות';
    }

    setFieldErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSuccess(null);
    setErrors({});

    resetMutation.mutate(
      {
        email,
        newPassword: formData.password,
        resetToken,
        isAdmin
      },
      {
        onSuccess: () => {
          setSuccess('הסיסמה עודכנה בהצלחה!');
          // Clear stored data
          localStorage.removeItem('resetEmail');
          localStorage.removeItem('isAdmin');
          localStorage.removeItem('resetToken');
          // Redirect to login page after 3 seconds
            router.push('/');
        },
        onError: (error: Error) => {
          console.error('Password reset error:', error);
          setErrors({ general: error.message || 'שגיאה בעדכון הסיסמה. אנא נסו שוב.' });
        },
      }
    );
  };

  // ============================================================================
  // RENDER
  // ============================================================================

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
            הזינו את הסיסמה החדשה
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

        {/* Forgot Password Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir="rtl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <input
                id="password"
                name="password"
                type="password"
                value={formData.password}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.password ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="הזינו סיסמה"
              />
              {fieldErrors.password && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.password}</p>
              )}
            </div>

            {/* Confirm Password Field */}
            <div>
              <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700 mb-2">
                אישור סיסמה
              </label>
              <input
                id="confirmPassword"
                name="confirmPassword"
                type="password"
                value={formData.confirmPassword}
                onChange={handleInputChange}
                autoComplete="new-password"
                required
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 ${
                  fieldErrors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="הזינו שוב את הסיסמה"
              />
              {fieldErrors.confirmPassword && (
                <p className="mt-1 text-sm text-red-600">{fieldErrors.confirmPassword}</p>
              )}
            </div>

            {/* Submit Button */}
            <LoadingButton 
              loading={resetMutation.isPending} 
              text="עדכן סיסמה" 
            />
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או</span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="text-center space-y-2">
            <p className="text-sm text-gray-600">
              זוכרים את הסיסמה?{" "}
              <Link href={isAdmin ? "/ADMIN/AdminLogin" : "/SupplierLogin"} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                התחברו
              </Link>
            </p>
            <p className="text-sm text-gray-600">
              אין לכם חשבון?{" "}
              <Link href="/SupplierRegister" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                הירשמו
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default React.memo(ForgotPasswordPage);
