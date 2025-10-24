"use client"
import { useClerk, useUser } from '@clerk/nextjs';
import React from 'react';

import { ActiveView } from '@/types/types';
import Navigation from './Navigation';

interface ControlPanelProps {
  activeView?: ActiveView;
  setActiveView?: (view: ActiveView) => void;
  isAdmin: boolean;
}



export default function ControlPanel({ activeView, setActiveView, isAdmin }: ControlPanelProps) {
  const { user } = useUser();
  const { signOut } = useClerk();

  const logoutUser = async () => {
    try {
      await signOut();
    } catch (error) {
      console.log("error during sign out:", error);
      alert("אירעה שגיאה בעת ההתנתקות. אנא נסה שוב.");
    }
  }




  return (
    <div className="bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header with title and user info */}
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">לוח בקרה</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {
                  !user ? (
                    <span className="inline-flex items-center">
                      <svg className="animate-spin h-3 w-3 sm:h-4 sm:w-4 text-gray-500 mr-2" xmlns="http://www.w3.org/w3.org/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      טוען...
                    </span>
                  ) : (
                    <span className="block sm:inline">
                      ברוך הבא, {user?.firstName || 'משתמש'} {user?.lastName || ''}
                    </span>
                  )
                }
              </p>
            </div>
            <button onClick={logoutUser} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              התנתק
            </button>
          </div>
          {/* Navigation Component */}
          {
            isAdmin && (
              <Navigation activeView={activeView!} setActiveView={setActiveView!} />
            )
          }
        </div>
      </header>
    </div>
  )
}