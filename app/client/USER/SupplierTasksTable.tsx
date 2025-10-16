import React from 'react';
import { useRouter } from 'next/navigation';
import { useUser } from '@clerk/nextjs';

// Import custom hook and components
import { useSupplierTasks, TaskWithSupplier } from '@/hooks/useSupplierTasks';
import { TaskRow } from '@/components/TaskRow';
import { LoadingState } from '@/components/LoadingState';
import { ErrorState } from '@/components/ErrorState';
import { EmptyState } from '@/components/EmptyState';

interface SupplierTasksTableProps {
  title?: string;
}

/**
 * Supplier Tasks Table Component
 * Displays a table of tasks assigned to the current supplier
 */
function SupplierTasksTable({ title = 'המשימות שלי' }: SupplierTasksTableProps) {
  const router = useRouter();
  const { user } = useUser();
  const user_id = user?.id as string;

  // Don't fetch tasks if no supplier ID
  const { tasks, loading, error } = useSupplierTasks(user_id);

  /**
   * Handle row click to navigate to task details
   */
  const handleRowClick = (task: TaskWithSupplier) => {
    router.push(`/supplier-task-details?taskId=${task.id}&supplierId=${task.supplierid}`);
  };

  // Show loading state
  if (loading) {
    return <LoadingState />;
  }

  // Show error state
  if (error) {
    return <ErrorState error={error} />;
  }

  // Show message if no session
  if (!user_id) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-8 text-center">
        <p className="text-gray-600">יש להתחבר כדי לראות את המשימות</p>
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
          <EmptyState />
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
