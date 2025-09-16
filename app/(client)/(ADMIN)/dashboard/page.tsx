"use client"
import TasksDashbaordDisplay from '@/app/(client)/(ADMIN)/(tasks)/Tasksdashboard';
import Add_task from '@/app/(client)/(ADMIN)/(tasks)/Add_task';
import AddSuppliers from '@/app/(client)/(ADMIN)/(suppliers)/AddSuppliers';
import ControlPanel from '@/app/(mini_components)/controlpanel';
import { useState } from 'react';

import ListOfCustomers from '@/app/(client)/(ADMIN)/(suppliers)/SuppliersMangement';
import ListOfTasks from '@/app/(client)/(ADMIN)/(tasks)/TasksMangment';
import React from 'react';

export  function ParentDashbaord() {
  const [content, setContent] = useState<React.ReactNode>(<TasksDashbaordDisplay />);
  const [activeTab, setActiveTab] = useState("/tasksdashboard");


  const navigate = (path: string) => {
    setActiveTab(path);
    switch(path){
      case "/tasksdashboard":
        return setContent(<TasksDashbaordDisplay />);
      case "/taskmanagement":
        return setContent(<Add_task />);
      case "/customermanagement":
        return setContent(<AddSuppliers />);
      case "/listofcustomers":
        return setContent(<ListOfCustomers  />);
      case "/listoftasks":
        return setContent(<ListOfTasks />);
      default:
        return setContent(<TasksDashbaordDisplay  />);
    }
  }

 


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

export default React.memo(ParentDashbaord);
