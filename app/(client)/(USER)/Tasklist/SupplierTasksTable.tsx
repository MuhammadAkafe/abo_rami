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

import { getStatusColor, getStatusText } from '@/app/styles/taskstyles'
import { useSession } from 'next-auth/react';

// Custom hook for getting supplier tasks
const useGetSupplierTasks = (supplierId: number) => {
  const [tasks, setTasks] = React.useState<TaskWithSupplier[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
    const fetchTasks = async () => {
      if (!supplierId) return;
      
      try {
        setLoading(true);
        const response = await fetch(`/api/Supplier/GetSupplierTasks?supplierId=${supplierId}`);
        if (!response.ok) {
          throw new Error('Failed to fetch tasks');
        }
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Failed to fetch tasks');
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [supplierId]);

  return { tasks, loading, error };
};

// Memoized TaskRow component for better performance
const TaskRow = React.memo(({ task, onRowClick }: { 
  task: TaskWithSupplier; 
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
      {task.date ? new Date(task.date).toLocaleDateString('he-IL') : 'לא מוגדר'}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status || '')}`}>
        {getStatusText(task.status || '')}
      </span>
    </td>
  </tr>
));

TaskRow.displayName = 'TaskRow';

function SupplierTasksTable({ title = 'המשימות שלי' }: { title?: string }) {
  const router = useRouter();
  const { data: session } = useSession();
  const supplierId = session?.user?.id;

  const { tasks, loading, error } = useGetSupplierTasks(supplierId as number);

  const handleRowClick = (task: TaskWithSupplier) => {
    // Navigate to supplier task details page
    router.push(`/supplier-task-details?taskId=${task.id}&supplierId=${task.supplierid}`);
  };

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="flex items-center justify-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <span className="mr-3 text-gray-600">טוען משימות...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8">
        <div className="text-center">
          <div className="text-red-600 text-lg mb-2">שגיאה</div>
          <p className="text-gray-600">{error}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm">
      <div className="px-6 py-4 border-b border-gray-200">
        <div className="flex justify-between items-center">
          <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
          <div className="text-sm text-gray-600">
            {tasks?.length || 0} משימות
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
            <p className="mt-1 text-sm text-gray-500">לא הוקצו לך משימות עדיין.</p>
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
                  תאריך
                </th>
                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                  סטטוס
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {tasks?.map((task: TaskWithSupplier) => (
                <TaskRow 
                  key={task.id} 
                  task={task} 
                  onRowClick={handleRowClick}
                />
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default SupplierTasksTable;
