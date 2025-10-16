import React from 'react';

interface ErrorStateProps {
  error: string;
}

/**
 * Error state component for the tasks table
 */
export const ErrorState: React.FC<ErrorStateProps> = ({ error }) => {
  return (
    <div className="bg-white rounded-lg shadow-sm p-8">
      <div className="text-center">
        <div className="text-red-600 text-lg mb-2">שגיאה</div>
        <p className="text-gray-600">{error}</p>
      </div>
    </div>
  );
};
