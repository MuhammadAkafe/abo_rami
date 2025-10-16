import React from 'react'

interface LoadingComponentProps {
  message: string;
}

export default function LoadingComponent({ message}: LoadingComponentProps) 
{
  return (
    <div className="flex justify-center items-center h-screen">
      <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-green-500"></div>
      <span className="ml-3 text-gray-600">{message}</span>
    </div>
  );
}

