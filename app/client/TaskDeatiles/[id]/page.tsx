"use client"

import { SignatureSection } from "@/components/packages/SignatureSection";
import { useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingComponent from "@/components/user/LoadingComponent";
import DeleteModal from "@/components/packages/DeleteModal";
import { useSession } from "@/app/client/SesstionProvider";
import { useFetchTask } from "@/hooks/useFetchTask";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useQueryClient } from "@tanstack/react-query";
import { Task } from "@/types/types";
import { updateTask, deleteTask } from "@/app/actions/TaskActions";

type TaskStatus = 'PENDING' | 'COMPLETED' | 'REJECTED';

function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isUpdatingStatus, setIsUpdatingStatus] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isRedirecting, setIsRedirecting] = useState(false);
  const session = useSession();
  const isAdmin = session?.role === 'ADMIN';
  const taskId = Array.isArray(params.id) ? params.id[0] : params.id;
  const { task, isLoading, error: taskError } = useFetchTask(taskId, !isRedirecting);
  const queryClient = useQueryClient();
  
  // Type assertion for task
  const typedTask = task as Task | null;

  const handleStatusUpdate = async (newStatus: TaskStatus) => {
    if (!typedTask || typedTask.status === newStatus) return;

    // Optimistic update - update UI immediately
    const previousTask = typedTask;
    queryClient.setQueryData<Task>(['task', taskId], (old) => {
      if (!old) return old;
      return { ...old, status: newStatus };
    });

    // Also update in tasks list cache
    queryClient.setQueriesData<Task[]>(
      { queryKey: ['tasks'] },
      (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(t => t.id === typedTask.id ? { ...t, status: newStatus } : t);
      }
    );

    setIsUpdatingStatus(true);
    try {
      const result = await updateTask(taskId!, { status: newStatus });

      if (result.error) {
        // Rollback on error
        queryClient.setQueryData(['task', taskId], previousTask);
        queryClient.setQueriesData<Task[]>(
          { queryKey: ['tasks'] },
          (oldData) => {
            if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? previousTask : t);
          }
        );
        toast.error(result.error || 'שגיאה בעדכון הסטטוס', {
          position: 'top-left',
          rtl: true,
        });
      } else {
        // Update cache with new task data
        if (result.task) {
          queryClient.setQueryData(['task', taskId], result.task);
          queryClient.setQueriesData<Task[]>(
            { queryKey: ['tasks'] },
            (oldData) => {
              if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? (result.task as unknown as Task) : t);
            }
          );
        }
        toast.success('הסטטוס עודכן בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(['task', taskId], previousTask);
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (oldData) => {
          if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? previousTask : t);
        }
      );
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
    if (!typedTask) return;

    // Optimistic update - update UI immediately
    const previousTask = typedTask;
    queryClient.setQueryData<Task>(['task', taskId], (old) => {
      if (!old) return old;
      return { ...old, url: signatureUrl };
    });

    // Also update in tasks list cache
    queryClient.setQueriesData<Task[]>(
      { queryKey: ['tasks'] },
      (oldData) => {
        if (!oldData) return oldData;
        return oldData.map(t => t.id === typedTask.id ? { ...t, url: signatureUrl } : t);
      }
    );

    try {
      const result = await updateTask(taskId!, { url: signatureUrl });

      if (result.error) {
        // Rollback on error
        queryClient.setQueryData(['task', taskId], previousTask);
        queryClient.setQueriesData<Task[]>(
          { queryKey: ['tasks'] },
          (oldData) => {
            if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? previousTask : t);
          }
        );
        toast.error(result.error || 'שגיאה בעדכון החתימה', {
          position: 'top-left',
          rtl: true,
        });
      } else {
        // Update cache with new task data
        if (result.task) {
          queryClient.setQueryData(['task', taskId], result.task);
          queryClient.setQueriesData<Task[]>(
            { queryKey: ['tasks'] },
            (oldData) => {
              if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? (result.task as unknown as Task) : t);
            }
          );
        }
        toast.success('החתימה עודכנה בהצלחה', {
          position: 'top-left',
          rtl: true,
        });
      }
    } catch (error) {
      // Rollback on error
      queryClient.setQueryData(['task', taskId], previousTask);
      queryClient.setQueriesData<Task[]>(
        { queryKey: ['tasks'] },
        (oldData) => {
          if (!oldData) return oldData;
              return oldData.map(t => t.id === typedTask.id ? previousTask : t);
        }
      );
      console.error('Error updating signature:', error);
      toast.error('שגיאה בעדכון החתימה', {
        position: 'top-left',
        rtl: true,
      });
    }
  };

  const handleDeleteTask = async () => {
    setIsDeleting(true);
    setIsRedirecting(true); // Set redirecting immediately to prevent refetches
    
    try {
      const result = await deleteTask(taskId!);

      if (result.error) {
        setIsRedirecting(false); // Reset if deletion failed
        toast.error(result.error || 'שגיאה במחיקת המשימה', {
          position: 'top-left',
          rtl: true,
        });
        setShowDeleteModal(false);
      } else {
        const deletedTaskId = params.id as string;
        
        // Cancel any ongoing queries for this task
        queryClient.cancelQueries({ queryKey: ['task', deletedTaskId] });
        
        // Remove the task query from cache immediately
        queryClient.removeQueries({ queryKey: ['task', deletedTaskId] });
        
        // Optimistically update all task queries to remove the deleted task
        queryClient.setQueriesData<Task[]>(
          { queryKey: ['tasks'] },
          (oldData) => {
            if (!oldData) return oldData;
            return oldData.filter(task => task.id !== deletedTaskId);
          }
        );
        
        // Invalidate all tasks queries to ensure fresh data on next fetch
        queryClient.invalidateQueries({ 
          queryKey: ['tasks'],
          refetchType: 'all'
        });
        
        setShowDeleteModal(false);
        
        // Use router.replace to avoid back button issues and redirect immediately
        router.replace(CLIENT_ROUTES.ADMIN.DASHBOARD);
      }
    } catch (error) {
      setIsRedirecting(false); // Reset if deletion failed
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
  if (taskError || !typedTask) {
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
                <p className="text-lg text-gray-900">{typedTask.address}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">תיאור</label>
                <p className="text-lg text-gray-900">{typedTask.description}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עיר</label>
                <p className="text-lg text-gray-900">{typedTask.city}</p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">עד תאריך</label>
                <p className="text-lg text-gray-900">
                  {typedTask.date ? new Date(typedTask.date).toLocaleDateString('he-IL') : 'לא צוין'}
                </p>
              </div>
            </div>

            {/* Supplier Information */}
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">שם ספק</label>
                <p className="text-lg text-gray-900">
                  {typedTask.supplier ? `${typedTask.supplier.firstName} ${typedTask.supplier.lastName}` : 'לא זמין'}
                </p>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">טלפון</label>
                <p className="text-lg text-gray-900">{typedTask.supplier?.phone || 'לא זמין'}</p>
              </div>
              
              <div>
                {isAdmin ? (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">סטטוס</label>
                    <span className={`inline-flex px-3 py-1 rounded-full text-sm font-medium ${
                      typedTask.status === 'COMPLETED' ? 'bg-green-100 text-green-800' :
                      typedTask.status === 'PENDING' ? 'bg-yellow-100 text-yellow-800' :
                      typedTask.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-gray-100 text-gray-800'
                    }`}>
                      {typedTask.status === 'COMPLETED' ? 'הושלם' :
                       typedTask.status === 'PENDING' ? 'ממתין' :
                       typedTask.status === 'REJECTED' ? 'נדחה' : 'לא ידוע'}
                    </span>
                  </>
                ) : (
                  <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">עדכן סטטוס</label>
                    <select
                      value={typedTask.status}
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
          task={typedTask} 
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
        itemName={`${typedTask.address} - ${typedTask.description}`}
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