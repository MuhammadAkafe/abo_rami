"use client"

import { signOut, useSession } from "next-auth/react"
import { ControlPanelProps } from '@/app/(types)/types';



export default function ControlPanel({ navigate, activeTab}: ControlPanelProps) {
  const { data   }  = useSession();
const logout = async () => {
  try {
    await signOut( { callbackUrl: '/Login' });
  }
   catch (error) {
    console.error('Logout failed:', error);
  }
}


    return (
        <div className="mb-6">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
                <p className="text-gray-600 text-sm">ברוך הבא, {data?.user?.name } </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {data?.user?.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
                </span>
                <button
                  onClick={logout}
                  className="px-3 py-1 text-sm bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors mr-4 cursor-pointer"
                >
                  התנתק
                </button>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Menu */}
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex space-x-6 py-3">
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "/tasksdashboard" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/tasksdashboard")}
              >
                לוח המשימות
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "/taskmanagement" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/taskmanagement")}
              >
                הוספת משימות
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "/customermanagement" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/customermanagement")}
              >
                הוספת ספק
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "/listofcustomers" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/listofcustomers")}
              >
                ניהול ספקים
              </button>
              <button 
                className={`px-4 py-2 text-sm font-medium rounded-md transition-colors ${
                  activeTab === "/listoftasks" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/listoftasks")}
              >
                ניהול משימות
              </button>
            </div>
          </div>
        </nav>
        </div>
    )
}