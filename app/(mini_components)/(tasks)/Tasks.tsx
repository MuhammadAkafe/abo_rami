import React from 'react'
import Link from 'next/link'
import { tasks } from '@/generated/prisma/client'
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../../styles/taskstyles'
function Tasks({ tasks=[] }: { tasks: Partial<tasks>[] | null}) {
  return (
    <div className="bg-white rounded-lg shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">משימות אחרונות</h2>
        <Link
          href="/tasklist"
          className="text-blue-600 hover:text-blue-800 text-sm font-medium"
        >
          צפה בכל המשימות
        </Link>
      </div>
    </div>

    <div className="divide-y divide-gray-200">
      {tasks?.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">אין משימות</h3>
          <p className="mt-1 text-sm text-gray-500">התחל על ידי יצירת משימה חדשה.</p>
        </div>
      ) : (
        tasks?.map((task) => (
          <div key={task.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{task.address}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority || '')}`}>
                    {getPriorityText(task.priority || '')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status || '')}`}>
                    {getStatusText(task.status || '')}
                  </span>
                  <span className="text-xs text-gray-500">
                    נוצר: {new Date(task.createdAt || '').toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  )
}

export default Tasks