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

interface CodeFormData {
  code: string;
}

interface VerifyOTPData {
  email: string;
  otp: string;
  isAdmin: boolean;
}

// ============================================================================
// MAIN COMPONENT
// ============================================================================

// API functions
const verifyOTP = async (data: VerifyOTPData) => {
  try {
    const response = await fetch('/api/verify-otp', {
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
    console.error('OTP verification error:', error);
    throw error;
  }
};

const resendOTP = async (data: { email: string; isAdmin: boolean }) => {
  try {
    const response = await fetch('/api/email', {
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
    console.error('Resend OTP error:', error);
    throw error;
  }
};

function CodePage() {
  const [formData, setFormData] = useState<CodeFormData>({
    code: ''
  });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [success, setSuccess] = useState<string | null>(null);
  const [email, setEmail] = useState<string>('');
  const [isAdmin, setIsAdmin] = useState<boolean>(false);
  const router = useRouter();

  // Get stored email and user type
  useEffect(() => {
    const storedEmail = localStorage.getItem('resetEmail');
    const storedIsAdmin = localStorage.getItem('isAdmin');
    
    if (!storedEmail) {
      router.push('/Email');
      return;
    }  
    setEmail(storedEmail);
    setIsAdmin(storedIsAdmin === 'true');
  }, [router]);

  // ============================================================================
  // EVENT HANDLERS
  // ============================================================================

  // Mutations
  const verifyMutation = useMutation({
    mutationFn: verifyOTP,
  });

  const resendMutation = useMutation({
    mutationFn: resendOTP,
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    // Only allow numbers and limit to 6 digits
    const numericValue = value.replace(/\D/g, '').slice(0, 6);
    
    setFormData(prev => ({
      ...prev,
      [name]: numericValue
    }));
    
    // Clear errors when user starts typing
    if (errors[name]) {
      setErrors(prev => ({
        ...prev,
        [name]: ''
      }));
    }
  };

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {};

    // Code validation
    if (!formData.code) {
      newErrors.code = 'קוד האימות נדרש';
    } else if (formData.code.length !== 6) {
      newErrors.code = 'קוד האימות חייב להכיל 6 ספרות';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setSuccess(null);
    setErrors({});

    verifyMutation.mutate(
      { email, otp: formData.code, isAdmin: isAdmin },
      {
        onSuccess: (data) => {
          setSuccess('קוד האימות אומת בהצלחה!');
          // Store reset token for password reset
          localStorage.setItem('resetToken', data.resetToken);
          // Redirect to forgot password page after 2 seconds
          setTimeout(() => {
            router.push('/ForgotPassword');
          }, 1000);
        },
        onError: (error: Error) => {
          console.error('Code verification error:', error);
          setErrors({ code: error.message || 'קוד האימות שגוי. אנא נסו שוב' });
        },
      }
    );
  };

  const handleResendCode = async () => {
    setSuccess(null);
    setErrors({});

    resendMutation.mutate(
      { email, isAdmin: isAdmin },
      {
        onSuccess: () => {
          setSuccess('קוד חדש נשלח לכתובת האימייל שלכם');
        },
        onError: (error: Error) => {
          console.error('Resend code error:', error);
          setErrors({ general: error.message || 'שגיאה בשליחת קוד חדש' });
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
            אימות קוד
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הזינו את קוד האימות שנשלח לכתובת האימייל שלכם
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

        {/* Code Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir="rtl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Code Field */}
            <div>
              <label htmlFor="code" className="block text-sm font-medium text-gray-700 mb-2">
                קוד אימות
              </label>
              <input
                id="code"
                name="code"
                type="text"
                value={formData.code}
                onChange={handleInputChange}
                required
                maxLength={6}
                className={`w-full px-4 py-3 border rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400 text-center text-2xl tracking-widest ${
                  errors.code ? 'border-red-500' : 'border-gray-300'
                }`}
                placeholder="000000"
              />
              {errors.code && (
                <p className="mt-1 text-sm text-red-600">{errors.code}</p>
              )}
            </div>

            {/* Submit Button */}
            <LoadingButton 
              loading={verifyMutation.isPending} 
              text="אמת קוד" 
            />
          </form>

          {/* Resend Code */}
          <div className="text-center">
            <button
              type="button"
              onClick={handleResendCode}
              disabled={resendMutation.isPending}
              className="text-sm text-blue-600 hover:text-blue-500 transition-colors disabled:opacity-50"
            >
              {resendMutation.isPending ? 'שולח...' : 'לא קיבלתם קוד? שלחו שוב'}
            </button>
          </div>

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
              <Link href={isAdmin ? "/AdminLogin" : "/SupplierLogin"} className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
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

export default React.memo(CodePage);
