import React from 'react';

/**
 * Loading state component for the tasks table
 */
export const LoadingState: React.FC = () => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
        <span className="mr-3 text-gray-600">טוען משימות...</span>
      </div>
    </div>
  );
};
