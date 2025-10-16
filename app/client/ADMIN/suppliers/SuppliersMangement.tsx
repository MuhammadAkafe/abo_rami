"use client"
import React, { useEffect, useState } from 'react';
import { useGetAllSuppliers } from '@/hooks/useGetAllSuppliers';
import SuppliersTable from './SuppliersTable';
import LoadingComponent from '@/components/LoadingComponent';
import { suppliers } from '@prisma/client';
import { useUser } from '@clerk/nextjs';
export default function SuppliersManagement() {
  const { user } = useUser();
  const user_id = user?.id as string;

  const { data: Suppliers, refetch, isLoading, error } = useGetAllSuppliers(user_id);

  const [filters, setFilters] = useState<suppliers[]>([]);  

  useEffect(() => {
    if (Suppliers) {
      setFilters(Suppliers);
    }
  }, [Suppliers]);

  const filterSuppliers = React.useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const searchTerm = e.target.value.toLowerCase();
    if (!searchTerm) {
      setFilters(Suppliers || []);
      return;
    }
    
    const filteredSuppliers = Suppliers?.filter((supplier: suppliers) => {
      return supplier.firstName.toLowerCase().includes(searchTerm) ||
             supplier.lastName.toLowerCase().includes(searchTerm) ||
             supplier.email.toLowerCase().includes(searchTerm) ||
             supplier.phone.includes(searchTerm);
    });
    setFilters(filteredSuppliers || []);
  }, [Suppliers]);

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">טבלת ספקים</h2>
          <div className="flex items-center gap-4">
            <div className="relative">
              <input onChange={filterSuppliers}
                type="text"
                placeholder="חיפוש ספקים..."
                className="w-64 px-4 py-2 pl-10 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
              <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </div>
            </div>
            <div className="text-sm text-gray-600">
              {(filters?.length ?? 0)} ספקים
            </div>
            <button
              className="text-gray-600 hover:text-gray-900 transition-colors"
              title="רענן רשימת ספקים"
              aria-label="רענן רשימת ספקים"
              onClick={() => refetch()}
            >
              <svg className="h-5 w-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" />
              </svg>
            </button>
          </div>
        </div>
      </div>

      {/* Table */}
      {isLoading ? (
        <LoadingComponent message="טוען ספקים..." />
      ) : error ? (
        <div className="p-8 text-center">
          <div className="text-red-600 text-lg mb-2">שגיאה בטעינת הספקים</div>
          <p className="text-gray-600 mb-4">{error.message || 'אירעה שגיאה לא צפויה'}</p>
          <button
            onClick={() => refetch()}
            className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            נסה שוב
          </button>
        </div>
      ) : (
        <SuppliersTable filters={filters} refetch={refetch} />
      )}
    </div>
  );
}
