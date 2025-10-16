"use client"
import TasksDashbaordDisplay from '@/app/client/ADMIN/tasks/Tasksdashboard';
import Add_task from '@/app/client/ADMIN/tasks/Add_task';
import AddSuppliers from '@/app/client/ADMIN/suppliers/AddSuppliers';
import ControlPanel from '@/components/controlpanel';
import { useState, useMemo, useCallback, Suspense } from 'react';

import ListOfCustomers from '@/app/client/ADMIN/suppliers/SuppliersMangement';
import ListOfTasks from '@/app/client/ADMIN/tasks/TasksMangment';
import React from 'react';

// Memoized components to prevent unnecessary re-renders
const MemoizedTasksDashboard = React.memo(TasksDashbaordDisplay);
const MemoizedAddTask = React.memo(Add_task);
const MemoizedAddSuppliers = React.memo(AddSuppliers);
const MemoizedListOfCustomers = React.memo(ListOfCustomers);
const MemoizedListOfTasks = React.memo(ListOfTasks);

function AdminDashbaord() {
  const [activeTab, setActiveTab] = useState<string | undefined>(undefined);

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
  }, []);

 


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Pass a function to navigate that returns a ReactNode */}
          <ControlPanel navigate={navigate} activeTab={activeTab} />    
          {/* Main Tasks Dashboard */}
          <div className="w-full">
            <div key={activeTab}>
              {content}
            </div>
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
      <AdminDashbaord />
    </Suspense>
  );
}
