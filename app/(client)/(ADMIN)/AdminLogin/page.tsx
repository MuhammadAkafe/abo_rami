"use client"
import { useState } from "react";
import { useRouter } from "next/navigation";
import LoadingButton from "@/app/components/loadingButton";
import React from "react";
import BackUpBtn from "@/app/components/backUpBtn";
import { useAdminSignUp } from "@/app/hooks/useAdminSignUp";


function AdminLoginPage() {
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const router = useRouter();
  const mutation = useAdminSignUp();

  const clearError = () => {
    setError(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    setIsLoading(true);
    setError(null);

    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;

    mutation.mutate({email, password}, {
      onSuccess: (result) => {
        if (result?.error) {
          // Display the actual error from the response
          setError(result.error);
          setIsLoading(false);
        } else {
          // Successful login
          setIsLoading(false);
          router.push('/dashboard');
        }
      },
      onError: (error: Error) => {
        // Display error from the mutation error
        setError(error?.message || 'שגיאה בהתחברות - בדקו את פרטי ההתחברות');
        setIsLoading(false);
      },
      onSettled: () => {
        setIsLoading(false);
      },
    });

  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <BackUpBtn />
      <div className="max-w-md w-full space-y-8">
        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
          כניסה מנהלים
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            התחברו לחשבון שלכם כמנהל
          </p>
        </div>


        {/* Error Message */}
        {error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{error}</p>
          </div>
        )}

        {/* Login Form */}
        <div className="bg-white rounded-2xl shadow-xl p-8 space-y-6" dir="rtl">
          <form className="space-y-6" onSubmit={handleSubmit}>
            {/* Email Field */}
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                כתובת אימייל
              </label>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                onChange={clearError}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="הזינו את כתובת האימייל שלכם"
              />
            </div>

            {/* Password Field */}
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                סיסמה
              </label>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                onChange={clearError}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="הזינו את הסיסמה שלכם"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <a href="/Email" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  שכחתם סיסמה?
                </a>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingButton
              loading={isLoading}
              text="התחברו"
            />
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}

export default React.memo(AdminLoginPage);