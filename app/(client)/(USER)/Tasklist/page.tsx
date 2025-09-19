"use client"

import React from 'react';
import SupplierTasksTable from './SupplierTasksTable';
import ControlPanel from '@/app/(mini_components)/controlpanel';

/**
 * Main Task List Page Component
 * Displays the supplier's assigned tasks with a control panel
 */
function TaskListPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <ControlPanel />
          <SupplierTasksTable title="המשימות שלי" />
        </div>
      </div>
    </div>
  );
}

export default TaskListPage;