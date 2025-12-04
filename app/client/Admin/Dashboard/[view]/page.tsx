"use client"
import Add_task from '@/components/admin/tasks/Add_task';
import AddSuppliers from '@/components/admin/suppliers/AddSuppliers';
import { Suspense } from 'react';

import React from 'react';
import LoadingComponent from '@/components/user/LoadingComponent';
import ControlPanel from '@/components/packages/Controlpanel';
import SuppliersTable from '@/app/client/Admin/Dashboard/SuppliersTable/page';
import TasksMangment from '@/app/client/Admin/Dashboard/TasksMangment/page';
import { ActiveView } from '@/types/types';
import { useParams } from 'next/navigation';



function DashboardView() {
  const params = useParams();
  const view = params?.view as string;
  
  // Validate and default to 'suppliers' if invalid view
  const validViews: ActiveView[] = ['suppliers', 'tasks', 'addSupplier', 'addTask', 'tokens'];
  const activeView: ActiveView = validViews.includes(view as ActiveView) 
    ? (view as ActiveView) 
    : 'suppliers';

  const renderActiveView = () => {
    switch (activeView) {
      case 'suppliers':
        return <SuppliersTable />;
      case 'tasks':
        return <TasksMangment />;
      case 'addSupplier':
        return <AddSuppliers />;
      case 'addTask':
        return <Add_task />;
      default:
        return <SuppliersTable />;
    }
  };

  // Dummy setActiveView since we're using URL-based routing
  const setActiveView = () => {};

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Header and Navigation */}
      <ControlPanel activeView={activeView} setActiveView={setActiveView} />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full">
          {renderActiveView()}
        </div>
      </div>
    </div>
  );
}

export default function DashboardViewPage() {
  return (
    <Suspense fallback={<LoadingComponent message="ADMIN DASHBOARD IS LOADING..." />}>
      <DashboardView />
    </Suspense>
  );
}

