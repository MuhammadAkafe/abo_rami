"use client"

import {  useState } from "react";
import { Status, tasks } from "@/generated/prisma/client";
import Tasksfilter from "../../(mini_components)/Tasksfilter";
export default function TasksPage() 
{
  const [tasks, setTasks] = useState<tasks[]>([]);

  const doneTasks = tasks.filter(task => task.status === Status.COMPLETED);
  const rejectedTasks = tasks.filter(task => task.status === Status.REJECTED);
  const pendingTasks = tasks.filter(task => task.status === Status.PENDING);

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-100 p-4" dir="rtl">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            לוח משימות
          </h1>
          <p className="text-lg text-gray-600">
            ניהול ומעקב אחר כל המשימות והפרויקטים
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-green-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">משימות שהושלמו</p>
                <p className="text-3xl font-bold text-green-600">{doneTasks.length}</p>
              </div>
              <div className="bg-green-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-red-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">משימות שנדחו</p>
                <p className="text-3xl font-bold text-red-600">{rejectedTasks.length}</p>
              </div>
              <div className="bg-red-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl shadow-lg p-6 border-l-4 border-yellow-500">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm font-medium text-gray-600">ממתין</p>
                <p className="text-3xl font-bold text-yellow-600">{pendingTasks.length}</p>
              </div>
              <div className="bg-yellow-100 p-3 rounded-full">
                <svg className="w-6 h-6 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        <Tasksfilter tasks={tasks} />
      </div>
    </div>
  );
}


