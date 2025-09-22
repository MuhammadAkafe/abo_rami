"use client"
import React, { Suspense } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';

// Import custom hook and components
import { useSupplierTaskDetails } from '../../../hooks/useSupplierTaskDetails';
import { TaskDetailsCard } from '../../../components/TaskDetailsCard';
import { SupplierDetailsCard } from '../../../components/SupplierDetailsCard';
import { UserDetailsCard } from '../../../components/UserDetailsCard';
import { SignatureSection } from '../../../components/SignatureSection';

/**
 * Supplier Task Details Component
 * Displays detailed information about a specific task assigned to a supplier
 */
function SupplierTaskDetailsContent() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const taskId = searchParams.get('taskId');
  const supplierId = searchParams.get('supplierId');
  
  // Determine if user is admin or supplier
  const isAdmin = session?.user && 'role' in session.user && session.user.role === 'ADMIN';
  const isSupplier = session?.user && 'role' in session.user && session.user.role === 'USER';
  
  // Use custom hook for data management
  const {
    task,
    supplier,
    loading,
    error,
    isEditingStatus,
    newStatus,
    statusUpdateLoading,
    setNewStatus,
    handleEditStatus,
    handleCancelEdit,
    handleStatusUpdate,
    handleSignatureUpdate,
  } = useSupplierTaskDetails(taskId, supplierId);


  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow-lg p-8">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
          <p className="text-center mt-4 text-gray-600">טוען נתונים...</p>
        </div>
      </div>
    );
  }

  if (error || !task || !supplier) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
        <div className="bg-white rounded-xl shadow-lg p-8 text-center">
          <button
            onClick={() => router.push(isAdmin ? '/dashboard' : '/Tasklist')}
            className="mb-6 group inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5"
          >
            <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            {isAdmin ? 'חזור ללוח הבקרה' : 'חזור לרשימת המשימות'}
          </button>
          <div className="text-red-600 text-xl mb-4">שגיאה</div>
          <p className="text-gray-600">{error || 'לא נמצאו נתונים'}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <button
        onClick={() => router.push(isAdmin ? '/dashboard' : '/Tasklist')}
        className="fixed top-6 right-6 z-50 group inline-flex items-center px-6 py-3 text-sm font-semibold text-white bg-gradient-to-r from-blue-600 to-indigo-600 rounded-xl shadow-lg hover:shadow-xl hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-4 focus:ring-blue-300 transition-all duration-200 transform hover:-translate-y-0.5"
      >
        <svg className="w-5 h-5 ml-2 transition-transform duration-200 group-hover:-translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        {isAdmin ? 'חזור ללוח הבקרה' : 'חזור לרשימת המשימות'}
      </button>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              פרטי משימה
            </h1>
            <p className="text-gray-600">
              מידע מפורט על המשימה שהוקצתה לך
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Task Details Card */}
            <TaskDetailsCard
              task={task}
              isEditingStatus={isEditingStatus}
              newStatus={newStatus}
              statusUpdateLoading={statusUpdateLoading}
              onEditStatus={handleEditStatus}
              onStatusChange={setNewStatus}
              onStatusUpdate={handleStatusUpdate}
              onCancelEdit={handleCancelEdit}
            />

            {/* Supplier Details Card */}
            <SupplierDetailsCard supplier={supplier} />

            {/* User Details Card */}
            <UserDetailsCard supplier={supplier} />
          </div>

          {/* Signature Section - Visible for all users, editable only for suppliers */}
          <SignatureSection 
            task={task} 
            onSignatureUpdate={handleSignatureUpdate}
            allowEdit={isSupplier}
          />

        </div>
      </div>
    </div>
  );
}

// Loading component for Suspense fallback
function SupplierTaskDetailsLoading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
      <div className="bg-white rounded-xl shadow-lg p-8">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto"></div>
        <p className="text-center mt-4 text-gray-600">טוען פרטי משימה...</p>
      </div>
    </div>
  );
}

export default function SupplierTaskDetails() {
  return (
    <Suspense fallback={<SupplierTaskDetailsLoading />}>
      <SupplierTaskDetailsContent />
    </Suspense>
  );
}
