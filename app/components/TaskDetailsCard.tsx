import React from 'react';
import { Status } from '@prisma/client';
import { getStatusColor, getStatusText } from '@/app/styles/taskstyles';
import { TaskWithSupplier } from '../hooks/useSupplierTasks';
import { useSession } from 'next-auth/react';
import { Session } from 'next-auth';

interface TaskDetailsCardProps {
  task: TaskWithSupplier;
  isEditingStatus: boolean;
  newStatus: Status;
  statusUpdateLoading: boolean;
  onEditStatus: () => void;
  onStatusChange: (status: Status) => void;
  onStatusUpdate: () => void;
  onCancelEdit: () => void;
}

/**
 * Task Details Card Component
 * Displays task information with status editing functionality
 */
export const TaskDetailsCard: React.FC<TaskDetailsCardProps> = ({
  task,
  isEditingStatus,
  newStatus,
  statusUpdateLoading,
  onEditStatus,
  onStatusChange,
  onStatusUpdate,
  onCancelEdit,
}) => {

  const {data: session} = useSession() as { data: Session | null };
  const isAdmin = session?.user?.role === 'ADMIN';
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
        </svg>
        פרטי המשימה
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">כתובת:</span>
          <span className="text-gray-900">{task.address}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">תיאור:</span>
          <span className="text-gray-900 text-right max-w-xs">{task.description}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">עיר:</span>
          <span className="text-gray-900">{task.city}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">תאריך:</span>
          <span className="text-gray-900">
            {task.date ? new Date(task.date).toLocaleDateString('he-IL') : 'לא מוגדר'}
          </span>
        </div>
        {!isAdmin && (
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">סטטוס:</span>
          <div className="flex items-center gap-3">
            {isEditingStatus ? (
              <div className="flex items-center gap-2">
                <select
                  value={newStatus}
                  onChange={(e) => onStatusChange(e.target.value as Status)}
                  className="px-3 py-1 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="PENDING">ממתין</option>
                  <option value="COMPLETED">הושלם</option>
                  <option value="REJECTED">נדחה</option>
                </select>
                <button
                  onClick={onStatusUpdate}
                  disabled={statusUpdateLoading}
                  className="px-3 py-1 bg-green-600 text-white text-sm rounded-md hover:bg-green-700 disabled:opacity-50"
                >
                  {statusUpdateLoading ? 'שומר...' : 'שמור'}
                </button>
                <button
                  onClick={onCancelEdit}
                  className="px-3 py-1 bg-gray-600 text-white text-sm rounded-md hover:bg-gray-700"
                >
                  ביטול
                </button>
              </div>
            ) : (
              <div className="flex items-center gap-2">
                <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status || '')}`}>
                  {getStatusText(task.status || '')}
                </span>
                <button
                  onClick={onEditStatus}
                  className="px-2 py-1 text-blue-600 hover:text-blue-800 text-sm"
                >
                  <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </button>
              </div>
            )}
          </div>
        </div>
        )}
      </div>
    </div>
  );
};
