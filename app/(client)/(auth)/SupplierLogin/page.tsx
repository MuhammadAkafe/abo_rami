"use client"
import Link from "next/link";
import { signIn } from "next-auth/react";
import LoadingButton from "@/app/components/loadingButton";
import React from "react";
import BackUpBtn from "@/app/components/backUpBtn";
import { Role } from "@prisma/client";
import { useMutation } from "@tanstack/react-query";
import { useRouter } from "next/navigation";


const SupplierSignIn = async (email: string, password: string) => {
  try {
    const result = await signIn('credentials', {
      email,
      password,
      role: Role.USER,
      redirect: false,
    });
    
    if (result?.error) {
      throw new Error('שגיאה בהתחברות - בדקו את פרטי ההתחברות');
    } 
    
    if (result?.ok) {
      // Get the user data to determine redirect
      try {
        const response = await fetch('/api/auth/session');
        if (!response.ok) {
          throw new Error('Failed to fetch session');
        }
        const sessionData = await response.json();
        return sessionData;
      } catch (sessionError) {
        console.error('Error fetching session:', sessionError);
        throw new Error('שגיאה בטעינת נתוני המשתמש');
      }
    }
    
    throw new Error('שגיאה בהתחברות - בדקו את פרטי ההתחברות');
  } catch (error) {
    console.error('Sign in error:', error);
    throw error;
  }
}



function LoginPage() {
  const router = useRouter();
  const mutation = useMutation({
    mutationFn: ({email, password}: {email: string, password: string}) => SupplierSignIn(email, password),
    onSuccess: (result) => {
      if (result && result.user?.role === Role.USER) {
        router.push('/Loading');
      }
    },
  });

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const email = formData.get('email') as string;
    const password = formData.get('password') as string;
    
    try {
      await mutation.mutateAsync({email, password});
    } catch (error) {
      // Error is already handled by the mutation
      console.error('Login error:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4 relative">
      {/* Back Button - Top Middle */}
      <BackUpBtn />
      
      <div className="max-w-md w-full space-y-8">

        {/* Header */}
        <div className="text-center">
          <h2 className="mt-6 text-3xl font-bold text-gray-900">
          כניסה ספקים
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            התחברו לחשבון שלכם
          </p>
        </div>


        {/* Error Message */}
        {mutation.error && (
          <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center">
            <p className="font-medium">{mutation.error.message}</p>
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
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-200 placeholder-gray-400"
                placeholder="הזינו את הסיסמה שלכם"
              />
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between">
              <div className="text-sm">
                <Link  href="/Email" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                  שכחתם סיסמה?
                </Link>
              </div>
            </div>

            {/* Submit Button */}
            <LoadingButton loading={mutation.isPending} text="התחברו" />
          </form>

          {/* Divider */}
          <div className="relative">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-300" />
            </div>
            <div className="relative flex justify-center text-sm">
              <span className="px-2 bg-white text-gray-500">או התחברו באמצעות</span>
            </div>
          </div>


          {/* Sign Up Link */}
          {/* <div className="text-center">
            <p className="text-sm text-gray-600">
              אין לכם חשבון?{" "}
              <Link href="/SupplierRegister" className="font-medium text-blue-600 hover:text-blue-500 transition-colors">
                הירשמו
              </Link>
            </p>
          </div> */}
        </div>
      </div>
    </div>
  );
}

export default React.memo(LoginPage);