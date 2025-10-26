'use client';
import React, { useState, useEffect } from 'react'
import DeleteModal from '@/components/DeleteModal';
import { DeleteModalState, supplierList } from '@/types/types';
import { useUser } from '@clerk/nextjs';
import { supplierList as supplier } from '@/types/types';
import LoadingComponent from '@/components/LoadingComponent';
import ErrorAlert from '@/components/ErrorAlert';
import useGetSuppliers from '@/hooks/Admin/useGetSuppliers';

import useDeleteSupplier from '@/hooks/Admin/useDeleteSupplier';
function SuppliersTable() 
{
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        Supplier: null,
        isLoading: false
    });

    const { isLoaded } = useUser();
    const { suppliers, error, refetch, isLoading } = useGetSuppliers();
    const { mutation } = useDeleteSupplier();

    // Refetch suppliers when component mounts
    useEffect(() => {
        if (isLoaded) {
            refetch();
        }
    }, [isLoaded, refetch]);





    const handleDeleteClick = (Supplier: supplier) => {
        console.log("Supplier clicked:", Supplier);
        setDeleteModal({
            isOpen: true,
            Supplier: Supplier,
            isLoading: false
        });
    };


    const handleDeleteConfirm = async () => {
        if (!deleteModal.Supplier) return;
        setDeleteModal({ isOpen: true, Supplier: deleteModal.Supplier, isLoading: true });
        
        try {
            await mutation.mutateAsync(deleteModal.Supplier.id as unknown as number);
            // Close modal and refetch data on success
            setDeleteModal({ isOpen: false, Supplier: null, isLoading: false });
            refetch();
        } catch (deleteError) {
            // Keep modal open on error, but stop loading
            console.error('Failed to delete supplier:', deleteError);
            setDeleteModal({ isOpen: true, Supplier: deleteModal.Supplier, isLoading: false });
        }
    };


    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, Supplier: null, isLoading: false });
    };


  // Handle user loading state
  if (!isLoaded) {
    return <LoadingComponent message="טוען משתמש..." />;
  }

  // Handle suppliers loading state
  if (isLoading) {
    return (<div className="flex justify-center items-center h-screen">
           <p className="text-gray-500 text-lg">טוען ספקים... </p>
        </div>);
  }

  // Handle error state
  if (error) {
    return (
      <ErrorAlert 
        message="שגיאה בטעינת הספקים. אנא נסה שוב." 
        onClose={() => window.location.reload()} 
      />
    );
  }







  return (
    <>
          <div className="overflow-x-auto ">
            <table className="w-full ">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם פרטי
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                שם משפחה
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                אימייל
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                טלפון
              </th>
              <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                תאריך הצטרפות
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {(!suppliers || suppliers.length === 0) ? (
              <tr>
                <td colSpan={6} className="px-6 py-12 text-center">
                  <div className="flex flex-col items-center">
                    <svg className="h-12 w-12 text-gray-400 mb-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                    </svg>
                    <p className="text-gray-500 text-lg">לא נמצאו ספקים</p>
                    <p className="text-gray-400 text-sm">נסה לשנות את מונח החיפוש</p>
                  </div>
                </td>
              </tr>
            ) : (
              suppliers?.map((Supplier: supplierList) => (
                <tr key={Supplier.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      <div className="flex-shrink-0 h-10 w-10">
                        <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                          <span className="text-white font-medium text-sm">
                            {Supplier.firstName.charAt(0).toUpperCase()}
                          </span>
                        </div>
                      </div>
                      <div className="mr-4">
                        <div className="text-sm font-medium text-gray-900">
                          {Supplier.firstName}
                        </div>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{Supplier.lastName}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{Supplier.email}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">  
                    <div className="text-sm text-gray-900">{Supplier.phone || 'לא צוין'}</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">
                      {Supplier.createdAt ? new Date(Supplier.createdAt).toLocaleDateString('he-IL') : ''}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <div className="flex items-center justify-center gap-1">
                        <button
                          onClick={() => handleDeleteClick(Supplier)}
                          className="text-red-600 cursor-pointer hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                          title="מחק"
                        >
                          <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                          </svg>
                        </button>
                    </div>
                  </td>
                </tr>
              ))
            )}
          </tbody>
            </table>
          </div>
          <DeleteModal
            isOpen={deleteModal.isOpen}
            onClose={handleDeleteCancel}
            onConfirm={handleDeleteConfirm}
            title="מחיקת ספק"
            message="האם אתה בטוח שברצונך למחוק את הספק הזה?"
            itemName={deleteModal.Supplier ? `${deleteModal.Supplier.firstName} ${deleteModal.Supplier.lastName}` : ''}
            isLoading={deleteModal.isLoading}
          />
        </>
  )
}

export default SuppliersTable