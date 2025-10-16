import React from 'react';
import { suppliers } from '@prisma/client';

interface SupplierWithUser extends suppliers {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface UserDetailsCardProps {
  supplier: SupplierWithUser;
}

/**
 * User Details Card Component
 * Displays user (admin) information
 */


export const UserDetailsCard: React.FC<UserDetailsCardProps> = ({ supplier }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-indigo-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
        </svg>
        פרטי מנהל
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">שם פרטי:</span>
          <span className="text-gray-900">{supplier.user.firstName}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">שם משפחה:</span>
          <span className="text-gray-900">{supplier.user.lastName}</span>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">אימייל:</span>
          <span className="text-gray-900">{supplier.user.email}</span>
        </div>
      </div>
    </div>
  );
};
