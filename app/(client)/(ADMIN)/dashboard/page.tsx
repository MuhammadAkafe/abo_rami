"use client"
import TasksDashbaordDisplay from '@/app/(client)/(ADMIN)/(tasks)/Tasksdashboard';
import Add_task from '@/app/(client)/(ADMIN)/(tasks)/Add_task';
import AddSuppliers from '@/app/(client)/(ADMIN)/(suppliers)/AddSuppliers';
import ControlPanel from '@/app/components/controlpanel';
import { useState, useMemo, useCallback, useEffect, Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';

import ListOfCustomers from '@/app/(client)/(ADMIN)/(suppliers)/SuppliersMangement';
import ListOfTasks from '@/app/(client)/(ADMIN)/(tasks)/TasksMangment';
import React from 'react';

// Memoized components to prevent unnecessary re-renders
const MemoizedTasksDashboard = React.memo(TasksDashbaordDisplay);
const MemoizedAddTask = React.memo(Add_task);
const MemoizedAddSuppliers = React.memo(AddSuppliers);
const MemoizedListOfCustomers = React.memo(ListOfCustomers);
const MemoizedListOfTasks = React.memo(ListOfTasks);

export function ParentDashbaord() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const [activeTab, setActiveTab] = useState("/tasksdashboard");

  // Initialize activeTab based on URL search parameters
  useEffect(() => {
    const tab = searchParams.get('tab');
    if (tab) {
      setActiveTab(`/${tab}`);
    }
  }, [searchParams]);

  // Memoize the content to prevent unnecessary re-renders
  const content = useMemo(() => {
    switch(activeTab){
      case "/tasksdashboard":
        return <MemoizedTasksDashboard />;
      case "/taskmanagement":
        return <MemoizedAddTask />;
      case "/customermanagement":
        return <MemoizedAddSuppliers />;
      case "/listofcustomers":
        return <MemoizedListOfCustomers />;
      case "/listoftasks":
        return <MemoizedListOfTasks />;
      default:
        return <MemoizedTasksDashboard />;
    }
  }, [activeTab]);

  const navigate = useCallback((path: string) => {
    setActiveTab(path);
    // Update URL with search parameter
    const tabName = path.replace('/', '');
    router.push(`/dashboard?tab=${tabName}`);
  }, [router]);

 


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Pass a function to navigate that returns a ReactNode */}
          <ControlPanel navigate={navigate} activeTab={activeTab} />    
          {/* Main Tasks Dashboard */}
          <div className="w-full">
         {content}
          </div>
        </div>
      </div>
    </div>
  )
}

// Loading component for Suspense fallback
function DashboardLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">טוען דשבורד...</p>
      </div>
    </div>
  );
}

export default function DashboardPage() {
  return (
    <Suspense fallback={<DashboardLoading />}>
      <ParentDashbaord />
    </Suspense>
  );
}
