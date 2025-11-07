"use client"
import React from 'react';

import { ActiveView } from '@/types/types';
import Navigation from './Navigation';
import { logoutAction } from '@/app/actions/auth';

interface ControlPanelProps {
  activeView?: ActiveView;
  setActiveView?: (view: ActiveView) => void;
  isAdmin: boolean;
  session?: {
    firstName: string;
    lastName: string;
  };
}

export default  function ControlPanel({ activeView, setActiveView, isAdmin, session }: ControlPanelProps) {


  const logoutSupplier = async () => {
    await logoutAction();
  }

  return (
    <div className="bg-gray-50">
      <header className="border-b border-gray-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          
          <div className="flex flex-col lg:flex-row lg:justify-between lg:items-center py-4 space-y-4 lg:space-y-0">
            <div className="flex-1">
              <h1 className="text-xl sm:text-2xl font-bold text-gray-900">לוח בקרה</h1>
              <p className="text-gray-600 text-xs sm:text-sm mt-1">
                {
                  isAdmin ? (
                    <span className="block sm:inline">
                      ברוך הבא, מנהל
                    </span>
                  ) : (
                    <span className="block sm:inline">
                      ברוך הבא, {session?.firstName || 'משתמש'} {session?.lastName || ''}
                    </span>
                  )
                }
              </p>
            </div>
            <button onClick={logoutSupplier} className="inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
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
