"use client"

import React, { useEffect, useState } from 'react'
import { users } from '@/generated/prisma/client';
function UserProfile() {
  const [user, setUser] = useState<users | null>(null);
  useEffect(() => {
    const fetchUser = async () => {
      const user = await fetch('/profile').then(res => res.json());
      setUser(user as users);
    };
    fetchUser();
  }, []);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
         
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