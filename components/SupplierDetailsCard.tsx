import React from 'react';
import { suppliers } from '@prisma/client';

interface SupplierWithUser extends suppliers {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
}

interface SupplierDetailsCardProps {
  supplier: SupplierWithUser;
}

/**
 * Supplier Details Card Component
 * Displays supplier information
 */
export const SupplierDetailsCard: React.FC<SupplierDetailsCardProps> = ({ supplier }) => {
  return (
    <div className="bg-white rounded-xl shadow-lg p-6">
      <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
        <svg className="w-6 h-6 text-green-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
        </svg>
        פרטי הספק
      </h2>
      
      <div className="space-y-4">
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">שם פרטי:</span>
          <span className="text-gray-900">{supplier.firstName}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">שם משפחה:</span>
          <span className="text-gray-900">{supplier.lastName}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">אימייל:</span>
          <span className="text-gray-900">{supplier.email}</span>
        </div>
        
        <div className="flex justify-between items-center py-3 border-b border-gray-200">
          <span className="font-medium text-gray-700">טלפון:</span>
          <span className="text-gray-900">{supplier.phone}</span>
        </div>
        
        <div className="flex justify-between items-center py-3">
          <span className="font-medium text-gray-700">תאריך הצטרפות:</span>
          <span className="text-gray-900">
            {new Date(supplier.createdAt).toLocaleDateString('he-IL')}
          </span>
        </div>
      </div>
    </div>
  );
};
