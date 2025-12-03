import React from 'react';

/**
 * Empty state component when no tasks are available
 */
export const EmptyTasksUi: React.FC = () => {
  return (
    <tr>
      <td colSpan={7} className="px-6 py-12">
        <div className="flex flex-col items-center justify-center text-center">
          <svg 
            className="mx-auto h-12 w-12 text-gray-400 mb-3" 
            fill="none" 
            stroke="currentColor" 
            viewBox="0 0 24 24"
          >
            <path 
              strokeLinecap="round" 
              strokeLinejoin="round" 
              strokeWidth={2} 
              d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" 
            />
          </svg>
          <h3 className="text-sm font-medium text-gray-900">אין משימות</h3>
        </div>
      </td>
    </tr>
  );
};
