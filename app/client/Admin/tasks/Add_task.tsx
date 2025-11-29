"use client"
import React, { useState, useEffect } from 'react';
import { Task } from '@/types/types';
import useAddTask from '@/hooks/Admin/useAddTask';
import useGetSuppliers from '@/hooks/Admin/useGetSuppliers';






export default function Add_task() {
  const { suppliers: suppliersList, isLoading: suppliersLoading, error: suppliersError, refetch } = useGetSuppliers();

  const [newTask,setNewTask] = useState<Task>({
    address: "",
    description: "",
    supplierId: "",
    date: "",
    city: "",
  });

  const [SelectedSupplier, setSelectedSupplier] = useState<string>("")



  // Re-render when suppliers are fetched
  useEffect(() => {
    if (suppliersList && suppliersList.length > 0) {
      console.log('Suppliers loaded, Add_task component re-rendering');
    }
  }, [suppliersList]);

  // Manual refresh function
  const handleRefreshSuppliers = () => {
    refetch();
  };

  const resetForm = () => {
    setNewTask({
      address: "",
      description: "",
      supplierId: "",
      date: "",
      city: "",
    });
    setSelectedSupplier("");
  }

  const { mutate, isPending, error, isSuccess } = useAddTask(resetForm);



  // Suppliers are now fetched via useGetSuppliers hook




  const handleFormInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    if (name === "supplierId") {
      setSelectedSupplier(value);
    }
    setNewTask(prev => ({ ...prev, [name]: value }));
  };


  const handleFormSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    mutate(newTask);
  };


  // Show loading state while suppliers are being fetched
  if (suppliersLoading) {
    return (
      <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8">
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת משימה</h2>
      </div>
      <form onSubmit={handleFormSubmit}>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף משימה חדשה</h3>
          
          {/* Error Display */}
          {error && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">שגיאה בהוספת המשימה</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {error.message}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Suppliers Error Display */}
          {suppliersError && (
            <div className="mb-4 p-4 bg-red-50 border border-red-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-red-800">שגיאה בטעינת הספקים</h3>
                  <div className="mt-2 text-sm text-red-700">
                    {suppliersError.message}
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Success Display */}
          {isSuccess && (
            <div className="mb-4 p-4 bg-green-50 border border-green-200 rounded-md">
              <div className="flex">
                <div className="flex-shrink-0">
                  <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
                  </svg>
                </div>
                <div className="ml-3">
                  <h3 className="text-sm font-medium text-green-800">המשימה נוספה בהצלחה!</h3>
                </div>
              </div>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת *</label>
              <input
                type="text"
                onChange={handleFormInputChange}
                name="address"
                value={newTask.address}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="הכנס כתובת"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור *</label>
              <input
                type="text"
                onChange={handleFormInputChange}
                name="description"
                value={newTask.description}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                placeholder="הכנס תיאור"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">שם ספק *</label>
              <select
                onChange={handleFormInputChange}
                name="supplierId"
                value={SelectedSupplier}
                disabled={isPending || suppliersLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">
                  {suppliersLoading ? "טוען ספקים..." : "בחר שם ספק"}
                </option>
                {suppliersList?.map((supplier) => (
                  <option key={supplier.id} value={supplier.id}>{supplier.firstName} {supplier.lastName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">עד תאריך *</label>
              <input
                type="date"
                name="date"
                min={new Date().toISOString().split('T')[0]}
                value={newTask.date as string}
                onChange={handleFormInputChange}
                disabled={isPending}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">איזור עבודה *</label>
              <select
                onChange={handleFormInputChange}
                name="city"
                value={newTask.city}
                disabled={isPending || suppliersLoading}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500 disabled:opacity-50 disabled:cursor-not-allowed"
                required
              >
                <option value="">בחר עיר</option>
                {SelectedSupplier && suppliersList?.find(supplier => supplier.id.toString() === SelectedSupplier)?.cities?.map((city) => (
                  <option key={city.id} value={city.city}>{city.city}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              type="button"
              disabled={isPending}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed"
            >
              ביטול
            </button>
            <button
              type="submit"
              disabled={isPending}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center"
            >
              {isPending ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  מוסיף...
                </>
              ) : (
                "הוסף משימה"
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}