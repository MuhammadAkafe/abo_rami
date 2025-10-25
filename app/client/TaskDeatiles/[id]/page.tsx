"use client"

import { SignatureSection } from "@/components/SignatureSection";
import { Task } from "@/types/types";
import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import LoadingComponent from "@/components/LoadingComponent";
import DeleteModal from "@/components/DeleteModal";
import { useUser } from "@clerk/nextjs";


function TaskDetailsPage() {
  const params = useParams();
  const router = useRouter();
  const [task, setTask] = useState<Task | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [deleteSuccess, setDeleteSuccess] = useState(false);
  const [selectedStatus, setSelectedStatus] = useState<string>('');
  const [isUpdating, setIsUpdating] = useState(false);
  const [updateSuccess, setUpdateSuccess] = useState(false);
  const {user} = useUser();
  const isAdmin = user?.publicMetadata.role ==="ADMIN";




  useEffect(() => {
    const fetchTask = async () => {
      try {
        setLoading(true);
        const response = await fetch(`/api/tasks/${params.id}`);
        if (response.ok) {
          const data = await response.json();
          setTask(data);
          setSelectedStatus(data.status || 'PENDING');
        } else {
          setError('Failed to fetch task');
        }
      } catch (err) {
        setError('Error fetching task');
        console.error('Error fetching task:', err);
      } finally {
        setLoading(false);
      }
    };

    if (params.id) {
      fetchTask();
    }
  }, [params.id]);

  const handleDeleteTask = async () => {
    if (!task?.id) return;
    
    try {
      setIsDeleting(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'DELETE',
      });
      
        if (response.ok) {
          setDeleteSuccess(true);
         router.push('/client/Admin/Dashboard');
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to delete task');
      }
    } catch (err) {
      setError('Error deleting task');
      console.error('Error deleting task:', err);
    }
     finally {
      setIsDeleting(false);
      setShowDeleteModal(false);
    }
  };

  const handleUpdateStatusTask = async () => {
    if (!task?.id || !selectedStatus) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ status: selectedStatus }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setError(null);
        setUpdateSuccess(true);
        // Hide success message after 3 seconds
          setUpdateSuccess(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update task status');
      }
    } catch (err) {
      setError('Error updating task status');
      console.error('Error updating task status:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  const handleSignatureUpdate = async (signatureData: string) => {
    if (!task?.id) return;
    
    try {
      setIsUpdating(true);
      const response = await fetch(`/api/tasks/${task.id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: signatureData }),
      });
      
      if (response.ok) {
        const updatedTask = await response.json();
        setTask(updatedTask);
        setError(null);
        setUpdateSuccess(true);
          setUpdateSuccess(false);
      } else {
        const errorData = await response.json();
        setError(errorData.error || 'Failed to update signature');
      }
    } catch (err) {
      setError('Error updating signature');
      console.error('Error updating signature:', err);
    } finally {
      setIsUpdating(false);
    }
  };

  if (loading) {
    return <LoadingComponent message="טוען פרטי המשימה..." />;
  }

  if (deleteSuccess) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="mb-4">
            <svg className="w-16 h-16 text-green-500 mx-auto" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
          </div>
          <h2 className="text-2xl font-bold text-gray-900 mb-4">המשימה נמחקה בהצלחה</h2>
          <p className="text-gray-600">מעביר אותך חזרה לרשימת המשימות...</p>
        </div>
      </div>
    );
  }

  if (error || !task) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <h2 className="text-2xl font-bold text-gray-900 mb-4">שגיאה</h2>
          <p className="text-gray-600">{error || 'Task not found'}</p>
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

        {/* Success Display */}
        {updateSuccess && (
          <div className="mb-6 p-4 bg-green-50 border border-green-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-green-800">הסטטוס עודכן בהצלחה</h3>
                <div className="mt-2 text-sm text-green-700">
                  הסטטוס של המשימה עודכן בהצלחה
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Error Display */}
        {error && (
          <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-md">
            <div className="flex">
              <div className="flex-shrink-0">
                <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                  <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                </svg>
              </div>
              <div className="mr-3">
                <h3 className="text-sm font-medium text-red-800">שגיאה</h3>
                <div className="mt-2 text-sm text-red-700">
                  {error}
                </div>
              </div>
            </div>
          </div>
        )}

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
                <label className="block text-sm font-medium text-gray-700 mb-1">תאריך</label>
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
                {
                    isAdmin?(
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
                    ):
                    <>
                    <label className="block text-sm font-medium text-gray-700 mb-1">עדכן סטטוס</label>
                    <select 
                      value={selectedStatus || task.status || 'PENDING'} 
                      onChange={(e) => setSelectedStatus(e.target.value)}
                      className="w-full p-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                    >
                        <option value="PENDING">ממתין</option>
                        <option value="COMPLETED">הושלם</option>
                        <option value="REJECTED">נדחה</option>
                    </select>
                    <button 
                      onClick={handleUpdateStatusTask} 
                      disabled={isUpdating || !selectedStatus}
                      className="w-full mt-2 p-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {isUpdating ? 'מעדכן...' : 'עדכן סטטוס'}
                    </button>
                    </>
                }
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
        itemName={task ? `${task.address} - ${task.description}` : ''}
        isLoading={isDeleting}
      />
    </div>
  );
}

export default TaskDetailsPage;