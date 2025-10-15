import React from 'react';
import { getStatusColor, getStatusText } from '@/styles/taskstyles';
import { TaskWithSupplier } from '@/hooks/useSupplierTasks';

interface TaskRowProps {
  task: TaskWithSupplier;
  onRowClick?: (task: TaskWithSupplier) => void;
}

/**
 * Individual task row component for the tasks table
 * Displays task information in a table row format
 */
export const TaskRow: React.FC<TaskRowProps> = React.memo(({ task, onRowClick }) => {
  const handleClick = () => {
    onRowClick?.(task);
  };

  return (
    <tr 
      className="hover:bg-gray-50 cursor-pointer transition-colors duration-200"
      onClick={handleClick}
    >
      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900">
        {task.address}
      </td>
      <td className="px-6 py-4 text-sm text-gray-500 max-w-xs truncate">
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
  );
});

TaskRow.displayName = 'TaskRow';
