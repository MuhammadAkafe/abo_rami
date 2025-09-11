import React from 'react'


function UserProfile({user}: {user: {firstName: string, lastName: string, email: string, phone: string} | null}) {
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex items-center mb-6">
        <div className="w-12 h-12 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full flex items-center justify-center mr-4">
          <span className="text-white font-bold text-lg">
            {user?.firstName?.charAt(0)}{user?.lastName?.charAt(0)}
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
    </div>
  )
}

export default UserProfile