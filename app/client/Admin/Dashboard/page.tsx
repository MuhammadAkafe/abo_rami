"use client"
import Add_task from '@/app/client/Admin/tasks/Add_task';
import AddSuppliers from '@/app/client/Admin/suppliers/AddSuppliers';
import { Suspense, useState } from 'react';

import React from 'react';
import LoadingComponent from '@/components/LoadingComponent';
import ControlPanel from '../../../../components/Controlpanel';
import SuppliersTable from '../suppliers/SuppliersTable';
import TasksMangment from '../tasks/TasksMangment';
import { ActiveView } from '@/types/types';





function Dashbaord() {
  const [activeView, setActiveView] = useState<ActiveView>('dashboard');
  const isAdmin=true;


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
      <ControlPanel activeView={activeView} setActiveView={setActiveView} isAdmin={isAdmin} />
      
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
