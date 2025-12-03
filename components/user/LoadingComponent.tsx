import React from 'react'

interface LoadingComponentProps {
  message: string;
}

export default function LoadingComponent({ message }: LoadingComponentProps) {
  return (
    <div className="fixed inset-0 bg-white bg-opacity-80 flex flex-col justify-center items-center z-50">
      <div className="flex flex-col items-center space-y-4">
        {/* Spinner */}
        <div className="relative">
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-gray-200"></div>
          <div className="animate-spin rounded-full h-16 w-16 border-4 border-green-500 border-t-transparent absolute top-0 left-0"></div>
        </div>
        
        {/* Loading message */}
        <div className="text-center">
          <p className="text-lg font-medium text-gray-700">{message}</p>
          <div className="flex space-x-1 mt-2">
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.1s' }}></div>
            <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{ animationDelay: '0.2s' }}></div>
          </div>
        </div>
      </div>
    </div>
  );
}

