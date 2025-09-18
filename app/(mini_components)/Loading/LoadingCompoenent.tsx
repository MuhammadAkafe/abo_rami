import React from 'react'

interface LoadingCompoenentProps {
  isLoading: boolean;
}

export default function LoadingCompoenent({isLoading}: LoadingCompoenentProps) {
    if (isLoading) {
        return (
          <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
            <div className="flex items-center justify-center">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="mr-3 text-gray-600">טוען מידע...</span>
            </div>
          </div>
        );
      }
}