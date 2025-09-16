import React, { useState } from 'react'
import Link from 'next/link'
import { tasks } from '@prisma/client'
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../../../styles/taskstyles'
import DeleteModal from '../../../(mini_components)/DeleteModal';

function TasksTable({ title='משימות היום', tasks: tasksData = [], refetch }: { title?: string, tasks?: tasks[], refetch?: () => void }) 
{
  const [tasks] = useState<tasks[]>(tasksData);
  const [deleteModal, setDeleteModal] = useState<{
    isOpen: boolean;
    task: tasks | null;
    isLoading: boolean;
  }>({
    isOpen: false,
    task: null,
    isLoading: false
  });

  const handleDeleteClick = (task: tasks) => {
    setDeleteModal({
      isOpen: true,
      task,
      isLoading: false
    });
  };

  const handleDeleteConfirm = async () => {
    if (!deleteModal.task) return;

    setDeleteModal(prev => ({ ...prev, isLoading: true }));

    try {
      const response = await fetch(`/api/deleteTask`, {
        method: 'DELETE',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ id: deleteModal.task.id }),
      });

      if (response.ok) {
        console.log("Task deleted successfully");
        if (refetch) refetch();
        setDeleteModal({ isOpen: false, task: null, isLoading: false });
      } else {
        console.error("Error deleting task");
        setDeleteModal(prev => ({ ...prev, isLoading: false }));
      }
    } catch (error) {
      console.error("Error deleting task:", error);
      setDeleteModal(prev => ({ ...prev, isLoading: false }));
    }
  };

  const handleDeleteCancel = () => {
    setDeleteModal({ isOpen: false, task: null, isLoading: false });
  };

  return (<>
<div className="bg-white rounded-lg shadow-sm">
</div>
    <div className="bg-white rounded-lg shadow-sm">
    <div className="px-6 py-4 border-b border-gray-200">
      <div className="flex justify-between items-center">
        <h2 className="text-xl font-semibold text-gray-900">{title}</h2>
        <div className="flex items-center space-x-4">
          <button
            onClick={() => {}}
            disabled={false}
            className="flex items-center p-2 text-gray-600 hover:text-gray-800 transition-colors disabled:opacity-50 disabled:cursor-not-allowed mr-4"
          >
            <svg 
              className={`w-5 h-5 cursor-pointer ${false ? 'animate-spin' : ''}`} 
              fill="none" 
              stroke="currentColor" 
              viewBox="0 0 24 24"
            >
              <path 
                strokeLinecap="round" 
                strokeLinejoin="round" 
                strokeWidth={2} 
                d="M4 4v5h.582m15.356 2A8.001 8.001 0 004.582 9m0 0H9m11 11v-5h-.581m0 0a8.003 8.003 0 01-15.357-2m15.357 2H15" 
              />
            </svg>
          </button>
          <Link
            href="/tasklist"
            className="text-blue-600 hover:text-blue-800 text-sm font-medium"
          >
            צפה בכל המשימות
          </Link>
        </div>
      </div>
    </div>

    <div className="divide-y divide-gray-200">
      {tasks?.length === 0 ? (
        <div className="px-6 py-8 text-center">
          <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v10a2 2 0 002 2h8a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
          </svg>
          <h3 className="mt-2 text-sm font-medium text-gray-900">אין משימות</h3>
          <p className="mt-1 text-sm text-gray-500">התחל על ידי יצירת משימה חדשה.</p>
        </div>
      ) : (
        tasks?.map((task: tasks) => (
          <div key={task.id} className="px-6 py-4">
            <div className="flex items-center justify-between">
              <div className="flex-1">
                <h3 className="text-sm font-medium text-gray-900">{task.address}</h3>
                <p className="text-sm text-gray-500 mt-1">{task.description}</p>
                <div className="mt-2 flex items-center space-x-4">
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getPriorityColor(task.priority || '')}`}>
                    {getPriorityText(task.priority || '')}
                  </span>
                  <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium ${getStatusColor(task.status || '')}`}>
                    {getStatusText(task.status || '')}
                  </span>
                  <span className="text-xs text-gray-500">
                    נוצר: {new Date(task.createdAt || '').toLocaleDateString('he-IL')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleDeleteClick(task)}
                  className="text-red-600 hover:text-red-900 p-1 rounded-md hover:bg-red-50 transition-colors"
                  title="מחק משימה"
                >
                  <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                  </svg>
                </button>
              </div>
            </div>
          </div>
        ))
      )}
    </div>
  </div>
  <DeleteModal
    isOpen={deleteModal.isOpen}
    onClose={handleDeleteCancel}
    onConfirm={handleDeleteConfirm}
    title="מחיקת משימה"
    message="האם אתה בטוח שברצונך למחוק את המשימה הזו?"
    itemName={deleteModal.task ? deleteModal.task.address : ''}
    isLoading={deleteModal.isLoading}
  />
  </>
  )
}

export default TasksTable