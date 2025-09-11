import React from 'react'
import { tasks, Status } from '@/generated/prisma/client'
function TasksStatus({ tasks=[] }: { tasks: Partial<tasks>[] | null}) 
{
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">סה״כ משימות</p>
          <p className="text-2xl font-semibold text-gray-900">{tasks?.length}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-blue-100 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
            </svg>
          </div>
        </div>
      </div>
    </div>


    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">ממתין</p>
          <p className="text-2xl font-semibold text-gray-900">{tasks?.filter(task => task.status === Status.PENDING).length}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-yellow-100 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-yellow-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">הושלם</p>
          <p className="text-2xl font-semibold text-gray-900">{tasks?.filter(task => task.status === Status.COMPLETED).length}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-green-100 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex items-center">
        <div className="flex-1">
          <p className="text-sm font-medium text-gray-500">נדחה</p>
          <p className="text-2xl font-semibold text-gray-900">{tasks?.filter(task => task.status === Status.REJECTED).length}</p>
        </div>
        <div className="flex-shrink-0">
          <div className="w-8 h-8 bg-red-100 rounded-md flex items-center justify-center">
            <svg className="w-5 h-5 text-red-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
            </svg>
          </div>
        </div>
      </div>
    </div>
  </div>
  )
}

export default TasksStatus