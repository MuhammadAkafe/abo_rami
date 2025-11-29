"use client"
import Add_task from '@/app/client/Admin/tasks/Add_task';
import AddSuppliers from '@/app/client/Admin/suppliers/AddSuppliers';
import { Suspense, useState, useEffect } from 'react';

import React from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import ControlPanel from '../../../../components/Controlpanel';
import SuppliersTable from '../suppliers/SuppliersTable';
import TasksMangment from '../tasks/TasksMangment';
import { ActiveView } from '@/types/types';
import { useSearchParams, useRouter } from 'next/navigation';

const navigationItems=[ 'suppliers', 'tasks', 'addSupplier', 'addTask'];


function Dashbaord() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const viewParam = searchParams.get('view') as ActiveView | null;
  
  // Initialize activeView from URL or default to 'dashboard'
  const [activeView, setActiveView] = useState<ActiveView>(
    (viewParam && navigationItems.includes(viewParam))
      ? viewParam
      : 'suppliers'
  );

  // Update URL when activeView changes
  const handleSetActiveView = (view: ActiveView) => {
    setActiveView(view);
    const params = new URLSearchParams(searchParams.toString());
    params.set('view', view);
    router.replace(`?${params.toString()}`, { scroll: false });
  };

  // Sync state with URL when URL changes
  useEffect(() => {
    if (viewParam && navigationItems.includes(viewParam)) {
      setActiveView(viewParam);
    }
  }, [viewParam]);

  // Set initial URL param if missing (only on mount)
  useEffect(() => {
    if (!viewParam) {
      const params = new URLSearchParams();
      params.set('view', activeView);
      router.replace(`?${params.toString()}`, { scroll: false });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []); // Only run on mount


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
        return (
          <SuppliersTable />
        );
    }
  };



  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Header and Navigation */}
      <ControlPanel activeView={activeView} setActiveView={handleSetActiveView}  />
      
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-4 sm:py-6 lg:py-8">
        <div className="w-full">
          {renderActiveView()}
        </div>
      </div>
    </div>
  )
}



export default function DashboardPage() {
  return (
    <Suspense fallback={<LoadingComponent message="ADMIN DASHBOARD IS LOADING..." />}>
      <Dashbaord />
    </Suspense>
  );
}
