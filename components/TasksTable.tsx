"use client"
import React from 'react'
import { TasksTableProps } from '@/types/types';
import { TaskRow } from '@/components/TaskRow';
import { EmptyTasksUi } from '@/components/EmptyTasksUi';
import { Task } from '@/types/types';
import { useRouter } from 'next/navigation';



function TasksTable({ title,tasks }: TasksTableProps) 
{
  const router=useRouter()
  const handleRowClick = (task: Task) => {
    router.push(`/client/TaskDeatiles/${task.id}`);
  }

  return (<>
    <div className="bg-white rounded-lg shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <button
            className="flex items-center p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-4"
            title="רענן רשימת משימות"
            aria-label="רענן רשימת משימות"
          >
            <svg 
              className="w-5 h-5 cursor-pointer" 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      {tasks && tasks.length === 0 ? <EmptyTasksUi /> : (
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                כתובת
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תיאור
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                עיר
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם ספק
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                מספר טלפון
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                פעולות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {/* Task Row */}
            {tasks && tasks.map((task: Task) => (
              <TaskRow key={task.id} task={task} onClick={() => handleRowClick(task)} />
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  </>
  )
}

export default TasksTable