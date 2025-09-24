import React from 'react'

interface LoadingComponentProps {
  message: string;
}

export default function LoadingComponent({ message}: LoadingComponentProps) 
{
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
      <div className="text-center">
        {/* Spinner */}
        <div className="flex justify-center mb-4">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
        </div>
        
        {/* Message */}
        <h3 className="text-lg font-medium text-gray-900 mb-2">{message}</h3>
        
        {/* Loading dots animation */}
        <div className="flex justify-center space-x-1">
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce"></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.1s'}}></div>
          <div className="w-2 h-2 bg-green-500 rounded-full animate-bounce" style={{animationDelay: '0.2s'}}></div>
        </div>
      </div>
    </div>
  );
}

