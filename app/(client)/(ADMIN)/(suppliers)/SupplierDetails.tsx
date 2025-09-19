"use client"
import React, { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import { suppliers, tasks } from '@prisma/client';
import { getStatusColor, getStatusText } from '@/app/styles/taskstyles';
import { useSession } from 'next-auth/react';

type TaskWithSupplier = tasks & {
  supplier?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
};

export default function SupplierDetails() {
  const searchParams = useSearchParams();
  const router = useRouter();
  const { data: session } = useSession();
  const taskId = searchParams.get('taskId');
  const supplierId = searchParams.get('supplierId');
  
  const [task, setTask] = useState<TaskWithSupplier | null>(null);
  const [supplier, setSupplier] = useState<suppliers | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      if (!taskId || !supplierId || !session?.user?.id) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      try {
        const userId = session.user.id;
        
        // Fetch task details
        const taskResponse = await fetch(`/api/ADMIN/GetAllTasks?userid=${userId}`);
        const tasks = await taskResponse.json();
        const foundTask = tasks.find((t: TaskWithSupplier) => t.id === parseInt(taskId));
        
        if (foundTask) {
          setTask(foundTask);
        }

        // Fetch supplier details
        const supplierResponse = await fetch(`/api/ADMIN/GetAllSuppliers?userid=${userId}`);
        const suppliers = await supplierResponse.json();
        const foundSupplier = suppliers.find((s: suppliers) => s.id === parseInt(supplierId));
        
        if (foundSupplier) {
          setSupplier(foundSupplier);
        }

        if (!foundTask || !foundSupplier) {
          setError('Task or supplier not found');
        }
      } catch (err) {
        console.error('Error fetching data:', err);
        setError('Failed to load data');
      } finally {
        setLoading(false);
      }
    };

    if (session?.user?.id) {
      fetchData();
    }
  }, [taskId, supplierId, session?.user?.id]);

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
            onClick={() => router.push('/dashboard')}
            className="mb-4 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            חזור לדשבורד
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
        onClick={() => router.push('/dashboard')}
        className="fixed top-4 right-4 z-50 inline-flex items-center px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-blue-500"
      >
        <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
        </svg>
        חזור לדשבורד
      </button>
      
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          
          {/* Header */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h1 className="text-3xl font-bold text-gray-900 mb-2">
              פרטי ספק ומשימה
            </h1>
            <p className="text-gray-600">
              מידע מפורט על הספק והמשימה
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            
            {/* Task Details */}
            <div className="bg-white rounded-xl shadow-lg p-6">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <svg className="w-6 h-6 text-blue-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                </svg>
                פרטי המשימה
              </h2>
              
              <div className="space-y-4">
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">כתובת:</span>
                  <span className="text-gray-900">{task.address}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">תיאור:</span>
                  <span className="text-gray-900 text-right max-w-xs">{task.description}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">עיר:</span>
                  <span className="text-gray-900">{task.city}</span>
                </div>
                
                <div className="flex justify-between items-center py-3 border-b border-gray-200">
                  <span className="font-medium text-gray-700">תאריך:</span>
                  <span className="text-gray-900">
                    {task.date ? new Date(task.date).toLocaleDateString('he-IL') : 'לא מוגדר'}
                  </span>
                </div>
                
                <div className="flex justify-between items-center py-3">
                  <span className="font-medium text-gray-700">סטטוס:</span>
                  <span className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(task.status || '')}`}>
                    {getStatusText(task.status || '')}
                  </span>
                </div>
              </div>
            </div>

            {/* Supplier Details */}
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
          </div>

          {/* Signature Section */}
          <div className="bg-white rounded-xl shadow-lg p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
              <svg className="w-6 h-6 text-purple-600 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
              </svg>
              חתימה דיגיטלית
            </h2>
            
            <div className="bg-gray-50 rounded-lg p-8 text-center">
              {task.url ? (
                <div>
                  <img 
                    src={task.url} 
                    alt="חתימת ספק" 
                    className="max-w-full h-auto mx-auto border border-gray-300 rounded-lg shadow-sm"
                    style={{ maxHeight: '300px' }}
                  />
                  <p className="text-sm text-gray-600 mt-4">חתימה דיגיטלית של הספק</p>
                </div>
              ) : (
                <div className="text-gray-500">
                  <svg className="w-16 h-16 mx-auto mb-4 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                  <p className="text-lg">אין חתימה זמינה</p>
                  <p className="text-sm text-gray-400">הספק עדיין לא העלה חתימה דיגיטלית</p>
                </div>
              )}
            </div>
          </div>

        </div>
      </div>
    </div>
  );
}
