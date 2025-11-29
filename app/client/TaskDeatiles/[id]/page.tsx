"use client"

import { SignatureSection } from "@/components/SignatureSection";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";
import DeleteModal from "@/components/DeleteModal";
import { useSession } from "@/app/client/SesstionProvider";
import { useFetchTask } from "@/hooks/useFetchTask";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/types";

type TaskStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isUpdatingSignature, setIsUpdatingSignature] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const session = useSession();
  const isAdmin = session?.role === 'ADMIN';
  const { task, isLoading, error: taskError, refetch } = useFetchTask(params.id as string);
  const queryClient = useQueryClient();

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    if (!task || task.status === newStatus) return;

    setIsUpdatingStatus(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (response.ok) {
        await refetch();
        toast.success('הסטטוס עודכן בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'שגיאה בעדכון הסטטוס', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      console.error('Error updating status:', error);
      toast.error('שגיאה בעדכון הסטטוס', {
        position: 'top-left',
        rtl: true,
      });
    } finally {
      setIsUpdatingStatus(false);
    }
  };

  const handleSignatureUpdate = async (signatureUrl: string) => {
    if (!task) return;

    setIsUpdatingSignature(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: signatureUrl }),
      });

      if (response.ok) {
        await refetch();
        toast.success('החתימה עודכנה בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'שגיאה בעדכון החתימה', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      console.error('Error updating signature:', error);
      toast.error('שגיאה בעדכון החתימה', {
        position: 'top-left',
        rtl: true,
      });
    } finally {
      setIsUpdatingSignature(false);
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    try {
      const response = await fetch(`/api/tasks/${params.id}`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const taskId = parseInt(params.id as string);
        
        // Optimistically update all task queries to remove the deleted task
        queryClient.setQueriesData<Task[]>(
          { queryKey: ['tasks'] },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter(task => task.id !== taskId);
          }
        );
        
        // Invalidate all tasks queries to ensure fresh data on next fetch
        queryClient.invalidateQueries({ 
          queryKey: ['tasks'],
          refetchType: 'all'
        });
        
        // Also remove any cached data for this specific task
        queryClient.removeQueries({ queryKey: ['task', params.id] });
        
        setShowDeleteModal(false);
        setIsRedirecting(true); // Prevent error state from showing
        
        // Use router.replace to avoid back button issues and redirect immediately
        router.replace(CLIENT_ROUTES.ADMIN.DASHBOARD);
      } else {
        const errorData = await response.json().catch(() => ({}));
        toast.error(errorData.error || 'שגיאה במחיקת המשימה', {
          position: 'top-left',
          rtl: true,
        });
        setShowDeleteModal(false);
      }
    } catch (error) {
      console.error('Error deleting task:', error);
      toast.error('שגיאה במחיקת המשימה', {
        position: 'top-left',
        rtl: true,
      });
      setShowDeleteModal(false);
    } finally {
      setIsDeleting(false);
    }
  };








  // Show loading state during initial load or redirect
  if (isLoading || isRedirecting) {
    return <LoadingComponent message={isRedirecting ? "מעביר לדף הבית..." : "טוען פרטי משימה..."} />;
  }

  // Show error state if there's an error or task doesn't exist (and not redirecting)
  if (taskError || !task) {
    return (
      <div className="min-h-screen bg-gray-50 py-8 flex items-center justify-center" dir="rtl">
        <div className="text-center">
          <p className="text-red-600 text-lg">שגיאה בטעינת המשימה</p>
          <button
            onClick={() => router.back()}
            className="mt-4 text-blue-600 hover:text-blue-800"
          >
            חזור
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 py-8" dir="rtl">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Back Button */}
        <div className="mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center text-gray-600 hover:text-gray-900 transition-colors cursor-pointer"
          >
            <svg className="w-5 h-5 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 19l-7-7 7-7" />
            </svg>
            חזור
          </button>
        </div>

        {/* Task Details */}
        <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center mb-6">
            <h1 className="text-3xl font-bold text-gray-900">פרטי המשימה</h1>
            {isAdmin && <button
              onClick={() => setShowDeleteModal(true)}
              className="flex items-center px-4 py-2 text-sm font-medium text-white bg-red-600 border border-red-600 rounded-md hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-red-500 transition-colors"
              title="מחק משימה זו"
            >
              <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
              </svg>
              מחק משימה
            </button>
            }
          </div>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Task Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">כתובת</label>
                <p className="text-lg text-gray-900">{task.address}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <p className="text-lg text-gray-900">{task.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
                <p className="text-lg text-gray-900">{task.city}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עד תאריך</label>
                <p className="text-lg text-gray-900">
                  {task.date ? new Date(task.date).toLocaleDateString('he-IL') : 'לא צוין'}
                </p>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם ספק</label>
                <p className="text-lg text-gray-900">
                  {task.supplier ? `${task.supplier.firstName} ${task.supplier.lastName}` : 'לא זמין'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <p className="text-lg text-gray-900">{task.supplier?.phone || 'לא זמין'}</p>
              </div>
              
              <div>
                {isAdmin ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      task.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      task.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      task.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {task.status === 'COMPLETED' ? 'הושלם' :
                       task.status === 'PENDING' ? 'ממתין' :
                       task.status === 'REJECTED' ? 'נדחה' : 'לא ידוע'}
                    </span>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">עדכן סטטוס</label>
                    <select
                      value={task.status}
                      onChange={(e) => handleStatusUpdate(e.target.value as TaskStatus)}
                      disabled={isUpdatingStatus}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      <option value="PENDING">ממתין</option>
                      <option value="COMPLETED">הושלם</option>
                      <option value="REJECTED">נדחה</option>
                    </select>
                    {isUpdatingStatus && (
                      <p className="mt-1 text-sm text-gray-500">מעדכן...</p>
                    )}
                  </>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Signature Section */}
        <SignatureSection 
          task={task} 
          allowEdit={!isAdmin} 
          onSignatureUpdate={handleSignatureUpdate}
        />
      </div>

      {/* Delete Modal */}
      <DeleteModal
        isOpen={showDeleteModal}
        onClose={() => setShowDeleteModal(false)}
        onConfirm={handleDeleteTask}
        title="מחיקת משימה"
        message="האם אתה בטוח שברצונך למחוק את המשימה?"
        itemName={`${task.address} - ${task.description}`}
        isLoading={isDeleting}
      />

      {/* Toast Container */}
      <ToastContainer
        position="top-left"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={true}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </div>
  );
}

export default TaskDetailsPage;