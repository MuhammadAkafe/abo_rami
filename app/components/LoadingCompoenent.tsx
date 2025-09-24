import React from 'react'

interface LoadingComponentProps {
  message: string;
}

export default function LoadingComponent({ message}: LoadingComponentProps) 
{
  return (
    <>
    <div className="fixed inset-0 bg-black/20 flex justify-center items-center z-50">
      <div className="bg-white rounded-lg shadow-xl max-w-md w-full mx-4">
        <div className="px-6 py-4 border-b border-gray-200">
          <h3 className="text-lg font-medium text-gray-900 sp">{message}</h3>
        </div>
      </div>
    </div>

    </>
  );
}

