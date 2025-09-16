"use client"
import React, { useState } from 'react';
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../../../styles/taskstyles';
import Fillter from './Fillter';
import { tasks } from '@prisma/client';
import TasksTable from './TasksTable';


export default function TaskManagement() {
  const [tasks, setTasks] = useState<tasks[]>([]);

  return (
    <>
        <div className="w-full">
          <Fillter />
        </div>
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">טבלת משימות</h2>
          <button
            className="text-gray-600 hover:text-gray-900 transition-colors"
            title="רענן"
          >
            <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
            </svg>
          </button>
        </div>
      </div>


      <TasksTable tasks={tasks} title="ניהול משימות " />
    </div>
    </>
  );
}