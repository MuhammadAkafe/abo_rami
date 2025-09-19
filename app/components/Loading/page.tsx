"use client"
import React from 'react';
import { usePostLoginChecks } from '@/app/hooks/usePostLoginChecks';

export default function PostLoginLoading() {
  const { loadingMessage } = usePostLoginChecks();

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
          <div className="text-center">
            <div className="flex items-center justify-center mb-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
            <h2 className="text-xl font-semibold text-gray-900 mb-2">
              {loadingMessage}
            </h2>
            <p className="text-gray-600 text-sm">
              אנא המתן...
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
