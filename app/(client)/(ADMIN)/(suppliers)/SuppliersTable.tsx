import { users } from '@prisma/client';
import React, { useState } from 'react'
import DeleteModal from '../../../(mini_components)/DeleteModal';
interface DeleteModalState 
{
    isOpen: boolean;
    user: users | null;
    isLoading: boolean;
}

function SuppliersTable({ users, refetch }: { users: users[], refetch: () => void }) 
{
    const [deleteModal, setDeleteModal] = useState<DeleteModalState>({
        isOpen: false,
        user: null,
        isLoading: false
    });
    const handleDeleteClick = (user: users) => {
        console.log("Supplier clicked:", user);
        setDeleteModal({
            isOpen: true,
            user: user,
            isLoading: false
        });
    };

    const handleDeleteConfirm = async () => {
        if (!deleteModal.user) return;

        setDeleteModal(prev => ({ ...prev, isLoading: true }));
        try {
            const response = await fetch(`/api/deleteUser?id=${deleteModal.user.id}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json',
                },
            });

            if (response.ok) {
                console.log("Supplier deleted successfully");
                refetch();
                setDeleteModal({ isOpen: false, user: null, isLoading: false });
            }
            else {
                console.error("Error deleting user");
                setDeleteModal(prev => ({ ...prev, isLoading: false }));
            }
        } 
        catch (error ) {
            console.error("Error deleting user:", error);
            setDeleteModal(prev => ({ ...prev, isLoading: false }));
        }
    };

    const handleDeleteCancel = () => {
        setDeleteModal({ isOpen: false, user: null, isLoading: false });
    };




  return (
    <>
    <div className="overflow-x-auto">
    <table className="w-full">
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
        {(users?.length || 0) === 0 ? (
          <tr>
            <td colSpan={7} className="px-6 py-12 text-center">
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
          (users || []).map((user: users) => (
            <tr key={user.id} className="hover:bg-gray-50 transition-colors">
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="flex items-center">
                  <div className="flex-shrink-0 h-10 w-10">
                    <div className="h-10 w-10 rounded-full bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
                      <span className="text-white font-medium text-sm">
                        {user.firstName.charAt(0).toUpperCase()}
                      </span>
                    </div>
                  </div>
                  <div className="mr-4">
                    <div className="text-sm font-medium text-gray-900">
                      {user.firstName}
                    </div>
                  </div>
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.lastName}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">{user.email}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">  
                <div className="text-sm text-gray-900">{user.phone}</div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap">
                <div className="text-sm text-gray-900">
                  {new Date(user.createdAt).toLocaleDateString('he-IL')}
                </div>
              </td>
              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                <div className="flex items-center justify-center gap-1">
                    <button
                      onClick={() => handleDeleteClick(user)}
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
    itemName={deleteModal.user ? `${deleteModal.user.firstName} ${deleteModal.user.lastName}` : ''}
    isLoading={deleteModal.isLoading}
  />
  </>
  )
}

export default SuppliersTable