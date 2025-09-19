import React, { useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { tasks } from '@prisma/client'
import { useEffect } from 'react'

type TaskWithSupplier = tasks & {
  supplier?: {
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
};
import { getStatusColor, getStatusText } from '../../../styles/taskstyles'
import DeleteModal from '@/app/components/DeleteModal';
import { useDeleteTask } from '@/app/hooks/useDeleteTask';
import { DeleteModalState, TasksTableProps } from '@/app/(types)/types';
import { useGetAllTasks } from '@/app/hooks/useGetAllTasks';
import { useSession } from 'next-auth/react';

// Memoized TaskRow component for better performance
const TaskRow = React.memo(({ task, onDeleteClick, showDeleteButton = true, onRowClick }: { 
  task: TaskWithSupplier; 
  onDeleteClick: (task: tasks) => void;
  showDeleteButton?: boolean;
  onRowClick?: (task: TaskWithSupplier) => void;
}) => (
  <tr 
    className="hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={() => onRowClick?.(task)}
  >
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
      {task.address}
    </td>
    <td className="px-6 py-4 text-sm text-gray-500">
      {task.description}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {task.city}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {task.supplier ? `${task.supplier.firstName} ${task.supplier.lastName}` : 'לא מוגדר'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {task.supplier?.phone || 'לא מוגדר'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {task.date ? new Date(task.date).toLocaleDateString('he-IL') : 'לא מוגדר'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status || '')}`}>
          {getStatusText(task.status || '')}
        </span>
        {showDeleteButton && (
          <button
            onClick={(e) => {
              e.stopPropagation(); // Prevent row click when clicking delete button
              onDeleteClick(task);
            }}
            className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
            title="מחק משימה"
          >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        )}
      </div>
    </td>
  </tr>
));

TaskRow.displayName = 'TaskRow';




function TasksTable({ title='משימות היום', filters, showDeleteButton = true }: TasksTableProps) 
{
  const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
    isOpen: false,
    task: null,
    isLoading: false
  });
  
  const router = useRouter();
  const mutation = useDeleteTask();
  const { data: session } = useSession();
  const User_id = session?.user?.id;
  const { data: tasks, refetch: refetchTasks } = useGetAllTasks(User_id as number, filters);

  // Optimize refetch to only run when necessary
  useEffect(() => {
    if (User_id) {
      refetchTasks();
    }
  }, [User_id, refetchTasks]);



  const handleDeleteClick = (task: tasks) => {
    setDeleteModal({
      isOpen: true,
      task,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

  mutation.mutate(deleteModal.task.id, 
    {
    onSuccess: () => {
      setDeleteModal({ isOpen: false, task: null, isLoading: false });
      refetchTasks?.();
    },
    onError: () => {
      setDeleteModal({ isOpen: false, task: null, isLoading: false });
    },
  });
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, task: null, isLoading: false });
  };

  const handleRowClick = (task: TaskWithSupplier) => {
    if (task.supplierid) {
      // Navigate to supplier task details page with task and supplier data
      router.push(`/supplier-task-details?taskId=${task.id}&supplierId=${task.supplierid}`);
    }
  };

  return (<>
<div className="bg-white rounded-lg shadow-sm">
</div>
    <div className="bg-white rounded-lg shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => refetchTasks()}
            disabled={false}
            className="flex items-center p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-4"
          >
            <svg 
              className={`w-5 h-5 cursor-pointer ${false ? 'animate-spin' : ''}`} 
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
          <Link
            href="/tasklist"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            צפה בכל המשימות
          </Link>
        </div>
      </div>
    </div>

    <div className="overflow-x-auto">
      {tasks?.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">אין משימות</h3>
          <p className="mt-1 text-sm text-gray-500">התחל על ידי יצירת משימה חדשה.</p>
        </div>
      ) : (
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
            {tasks?.map((task: TaskWithSupplier) => (
              <TaskRow 
                key={task.id} 
                task={task} 
                onDeleteClick={handleDeleteClick}
                showDeleteButton={showDeleteButton}
                onRowClick={handleRowClick}
              />
            ))}
          </tbody>
        </table>
      )}
    </div>
  </div>
  {showDeleteButton && (
    <DeleteModal
      isOpen={deleteModal.isOpen}
      onClose={handleDeleteCancel}
      onConfirm={handleDeleteConfirm}
      title="מחיקת משימה"
      message="האם אתה בטוח שברצונך למחוק את המשימה הזו?"
      itemName={deleteModal.task ? deleteModal.task.address : ''}
      isLoading={deleteModal.isLoading}
    />
  )}
  </>
  )
}

export default TasksTable