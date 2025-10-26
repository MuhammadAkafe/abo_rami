
import React from 'react';
import { Task } from '@/types/types';


interface TaskRowProps {
  task: Task;
  onClick: () => void;
}

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
      {task.date ? (typeof task.date === 'string' && task.date.split('T')[0]) : ''}
    </td>
    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium">
      <div className="flex items-center gap-2">
        <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-blue-100 text-blue-800">
          {task.status}
        </span>
      </div>
    </td>
  </tr>
);


TaskRow.displayName = 'TaskRow';