"use client"
import React, { useState } from 'react';

import { ActiveView } from '@/types/types';
import Navigation from './Navigation';
import { clearSession } from '@/lib/session';
import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES } from '@/app/constans/constans';
import { useSession } from '@/app/client/SesstionProvider';
import { Loader2 } from 'lucide-react';

interface ControlPanelProps {
  activeView?: ActiveView;
  setActiveView?: (view: ActiveView) => void;
}

export default  function ControlPanel({ activeView, setActiveView }: ControlPanelProps) {
  const router = useRouter();
  const session=useSession();
  const [isLoading, setIsLoading] = useState(false);
  const role=session?.role;
  console.log(role);

  const logout = async () => {
    try {
      setIsLoading(true);
      await clearSession();
      router.push(CLIENT_ROUTES.HOME);
      setIsLoading(false);
    } 
    catch (error) 
    {
      console.log(error);
    }
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
                  role=="ADMIN" ? (
                    <span className="block sm:inline">
                      ברוך הבא, {session?.firstName} {session?.lastName} מנהל
                    </span>
                  ) : (
                    <span className="block sm:inline">
                      ברוך הבא {session?.firstName} {session?.lastName}
                    </span>
                  )
                }
              </p>
            </div>
            <button onClick={logout} className="cursor-pointer inline-flex items-center px-3 py-2 border border-transparent text-sm leading-4 font-medium rounded-md text-white bg-red-600 hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors duration-200">
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1" />
              </svg>
              {isLoading ? <Loader2 className="w-4 h-4 animate-spin" /> : "התנתק"}
            </button>
          </div>
          {/* Navigation Component */}
          {
            role==="ADMIN" && (
              <Navigation activeView={activeView!} setActiveView={setActiveView!} />
            )
          }
        </div>
      </header>
    </div>
  )
}
