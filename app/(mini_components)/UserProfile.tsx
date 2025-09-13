"use client"

import React from 'react'
import { users } from '@/generated/prisma/client';
import { useQuery } from '@tanstack/react-query';


const fetchUser = async () => {
  // Check if we're on the client side before accessing localStorage
  if (typeof window === 'undefined') {
    throw new Error('Not on client side');
  }
  
  const user_id = localStorage.getItem('userid');
  if (!user_id) {
    throw new Error('No user ID found');
  }
  
  const response = await fetch('/profile', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ userId: user_id }),
  });
  
  if (!response.ok) {
    throw new Error('Failed to fetch user profile');
  }
  
  return response.json() as Promise<users>;
};


function UserProfile() {
  const { data: user, isLoading, error } = useQuery({
    queryKey: ['profile'],
    queryFn: fetchUser,
    enabled: typeof window !== 'undefined' && !!localStorage.getItem('userid'),
    retry: 1,
  });


  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600">טוען מידע...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <div className="text-red-500 mb-4">
            <svg className="mx-auto h-12 w-12" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.964-.833-2.732 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
            </svg>
          </div>
          <h3 className="text-lg font-medium text-gray-900 mb-2">שגיאה בטעינת הפרופיל</h3>
          <p className="text-gray-600">{error.message}</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">לא נמצא מידע משתמש</h3>
          <p className="text-gray-600">אנא התחברו מחדש</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
            {user.firstName?.charAt(0) || 'U'}
          </span>
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">מידע אישי</h2>
          <p className="text-gray-600">פרטי המשתמש הנוכחי</p>
        </div>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
          <label className="block text-sm font-semibold text-gray-700 mb-2">שם פרטי</label>
          <p className="text-lg font-medium text-gray-900">{user?.firstName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
          <label className="block text-sm font-semibold text-gray-700 mb-2">שם משפחה</label>
          <p className="text-lg font-medium text-gray-900">{user?.lastName}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
          <label className="block text-sm font-semibold text-gray-700 mb-2">אימייל</label>
          <p className="text-lg font-medium text-gray-900 break-all">{user?.email}</p>
        </div>
        <div className="bg-gray-50 rounded-lg p-4 hover:bg-gray-100 transition-colors">
          <label className="block text-sm font-semibold text-gray-700 mb-2">טלפון</label>
          <p className="text-lg font-medium text-gray-900">{user?.phone}</p>
        </div>
      </div>
      
      <form action="/logout" method="post" className="mt-8 flex justify-end">
        <button
          type="submit"
          className="bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-6 rounded-lg transition-colors duration-200 shadow-md hover:shadow-lg"
        >
          התנתק
        </button>
      </form>
      
    </div>
  )
}

export default UserProfile