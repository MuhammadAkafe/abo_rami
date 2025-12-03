
import React from 'react';
import { Task } from '@/types/types';


interface TaskRowProps {
  task: Task;
  onClick: () => void;
}

// Helper function to format date whether it's a Date object or string
const formatDate = (date: Date | string | undefined): string => {
  if (!date) return '';
  
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return '';
    
    // Format as YYYY-MM-DD
    return dateObj.toISOString().split('T')[0];
  } catch {
    return '';
  }
};

export const TaskRow = React.memo(({ task, onClick }: TaskRowProps) => 
  <tr 
    className="hover:bg-gray-50 cursor-pointer transition-colors"
    onClick={onClick}
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
      {task.supplier?.firstName} {task.supplier?.lastName}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {task.supplier?.phone}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
      {formatDate(task.date)}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center gap-2">
        <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${
          task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
          task.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
          task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
          'bg-gray-100 text-gray-800'
        }`}>
          {task.status}
        </span>
      </div>
    </td>
  </tr>
);


TaskRow.displayName = 'TaskRow';