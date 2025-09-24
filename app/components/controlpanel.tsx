"use client"

import { useSession } from "next-auth/react"
import type { Session } from 'next-auth';
import { ControlPanelProps } from '@/app/(types)/types';
import { useState } from "react";
import { logout } from "./logout";
import LoadingButton from "./loadingButton";



export default function ControlPanel({ navigate, activeTab}: ControlPanelProps) {
  const { data, status }  = useSession() as { data: Session | null; status: string };
  const [isLoading, setIsLoading] = useState(false);

    return (
        <div className="mb-6">
        <header className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-4">
              <div>
                <h1 className="text-2xl font-bold text-gray-900">לוח בקרה</h1>
                <p className="text-gray-600 text-sm">
                  ברוך הבא, {status === "authenticated" ? data?.user?.name : 
                    <span className="inline-flex items-center">
                      <svg className="animate-spin h-4 w-4 text-gray-500 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      טוען...
                    </span>
                  }
                </p>
              </div>
              <div className="flex items-center space-x-4">
                <span className="text-sm text-gray-500">
                  {status === "authenticated" ? data?.user?.role === 'ADMIN' ? 'מנהל' : 'משתמש' : "משתמש"}
                </span>
                <div className="mr-4">
                  <LoadingButton
                    loading={isLoading}
                    text="התנתק"
                    variant="danger"
                    handleClick={() => logout({setIsLoading})}
                  />
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Navigation Menu */}
        {
          data?.user?.role === 'ADMIN' ? (
          <>
        <nav className="border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            {/* Mobile Navigation - Horizontal Scroll */}
            <div className="flex overflow-x-auto py-3 space-x-2 md:space-x-6 scrollbar-hide">
              <button 
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "/tasksdashboard" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/tasksdashboard")}
              >
                לוח המשימות
              </button>
              <button 
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "/taskmanagement" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/taskmanagement")}
              >
                הוספת משימות
              </button>
              <button 
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "/customermanagement" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/customermanagement")}
              >
                הוספת ספק
              </button>
              <button 
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
                  activeTab === "/listofcustomers" 
                    ? "bg-blue-100 text-blue-700 border border-blue-200" 
                    : "text-gray-700 hover:text-gray-900 hover:bg-gray-100"
                }`} 
                onClick={() => navigate?.("/listofcustomers")}
              >
                ניהול ספקים
              </button>
              <button 
                className={`px-3 py-2 text-xs md:text-sm font-medium rounded-md transition-colors whitespace-nowrap flex-shrink-0 ${
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
          </>
          ) : null
        }
        </div>
    )
}