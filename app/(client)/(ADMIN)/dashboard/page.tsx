"use client"
import UserProfile from '../../../(mini_components)/UserProfile';
import TasksDashbaordDisplay from '@/app/(mini_components)/Tasksdashboard';
import TaskManagement from '@/app/(mini_components)/TaskManagement';
import CustomerManagement from '@/app/(mini_components)/CustomerManagement';
import ControlPanel from '@/app/(mini_components)/controlpanel';
import { useState } from 'react';

export default function ParentDashbaord() {
  const [content, setContent] = useState<React.ReactNode>(<TasksDashbaordDisplay tasks={[]} />);
  const [activeTab, setActiveTab] = useState("/tasksdashboard");

  const navigate = (path: string) => {
    setActiveTab(path);
    switch(path){
      case "/tasksdashboard":
        return setContent(<TasksDashbaordDisplay tasks={[]} />);
      case "/taskmanagement":
        return setContent(<TaskManagement tasks={[]} />);
      case "/customermanagement":
        return setContent(<CustomerManagement customers={[]} />);
      default:
        return null;
    }
  }


  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      {/* Main Content Container */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Pass a function to navigate that returns a ReactNode */}
          <ControlPanel user={null} navigate={navigate} activeTab={activeTab} />    
          {/* User Profile Card */}
          <div className="mb-8">
            <UserProfile user={null} />
          </div>

          {/* Main Tasks Dashboard */}
          <div className="w-full">
         {content}
          </div>
        </div>
      </div>
    </div>
  )
}


