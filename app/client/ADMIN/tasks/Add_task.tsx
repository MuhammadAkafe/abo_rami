"use client"
import React, { useEffect, useState } from 'react';
import { users, cities } from '@prisma/client';
import { useMemo } from 'react';
import { useAddTask } from '@/hooks/useAddTask';
import { useGetAllSuppliers } from '@/hooks/useGetAllSuppliers';

import { NewTask } from '@/types/types';
import { useUser } from '@clerk/nextjs';



export default function Add_task() {


  const { user } = useUser();
  const user_id = user?.id as string;
  // Get today's date in Israel timezone
  const getTodayIsraelDate = () => {
    const now = new Date();
    // Israel is UTC+2 (standard time) or UTC+3 (daylight saving time)
    // Using Intl.DateTimeFormat to get the correct timezone
    const israelDate = new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(now);
    return israelDate; // Returns YYYY-MM-DD format
  };

  // Convert date to Israel timezone for display
  const formatDateForInput = (date: Date | null) => {
    if (!date) return '';
    return new Intl.DateTimeFormat('en-CA', {
      timeZone: 'Asia/Jerusalem',
      year: 'numeric',
      month: '2-digit',
      day: '2-digit'
    }).format(date);
  };


  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState<NewTask>(
    {
    address: '',
    description: '',
    Supplier_id: null,
    date: null,
    city: '',
  });

  const [TaskCities, setTaskCities] = useState<cities[]>([]);
  const [selectedCity, setSelectedCity] = useState<string>('');


  const { data: users = [], isLoading: usersLoading, error: usersError } = useGetAllSuppliers(user_id);
  const { mutate: addTask, isPending, isError, isSuccess, error } = useAddTask(setNewTask, setShowAddForm);


  useEffect(() => {
    const fetchExistingCities = async () => {
      if (!newTask.Supplier_id) {
        return;
      }
      
      try {
        const response = await fetch(`/api/GetAllCities?supplier_id=${newTask.Supplier_id}`);
        if (!response.ok) {
          throw new Error('Failed to fetch cities');
        }
        const data = await response.json();
        setTaskCities(data);
      } catch (error) {
        console.error('Error fetching cities:', error);
        setTaskCities([]);
      }
    };
    
    fetchExistingCities();
  }, [newTask.Supplier_id]);





  const filteredUsers = useMemo(() => {
    if (!user_id) {
      return users;
    }
    return users.filter((user: users) => Number(user.id) !== Number(user_id));
  }, [users, user_id]);



  const handleChange= (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const {name,value} = e.target;
    setNewTask({ ...newTask, [name]: value });
  };





  const handleAddTask = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    // Validate all required fields
    if (!newTask.Supplier_id || !newTask.address || !newTask.description || !newTask.date || !selectedCity || !user_id) {
      console.error('Missing required fields for task creation');
      return;
    }

    const taskData: NewTask = { ...newTask, city: selectedCity };

    if (!user_id) {
      console.error('User not authenticated');
      return;
    }


    addTask({taskData,userid:user_id as string},{
      onSuccess: () => {
        setShowAddForm(false);
      },
      onError: (error) => {
        console.error('Error adding task:', error);
      }
    });




  };


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">הוספת משימה</h2>
        <button
          onClick={() => {
            setShowAddForm(!showAddForm);
            if (showAddForm) {
              setTaskCities([]);
              setSelectedCity('');
            }
          }}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors cursor-pointer"
        >
          {showAddForm ? 'ביטול' : 'הוסף משימה חדשה'}
        </button>
      </div>

      {isError && (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded-lg text-center mb-4">
          <p className="font-medium">{error?.message || 'שגיאה בהוספת המשימה'}</p>
        </div>
      )}
      {isSuccess && (
        <div className="bg-green-100 border border-green-400 text-green-700 px-4 py-3 rounded-lg text-center mb-4">
          <p className="font-medium">המשימה נוספה בהצלחה</p>
        </div>
      )}
      {/* Add Task Form */}
      {showAddForm && (
        <form onSubmit={handleAddTask}>
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף משימה חדשה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת *</label>
              <input
                type="text"
                name="address"
                value={newTask.address}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס כתובת"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור *</label>
              <input
                type="text"
                name="description"
                value={newTask.description}
                onChange={(e) => handleChange(e as React.ChangeEvent<HTMLInputElement>)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס תיאור"
                required
              />
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם ספק *</label>
                <select
                  name="Supplier_id"
                  value={newTask.Supplier_id || ''}
                  onChange={(e) => handleChange(e as React.ChangeEvent<HTMLSelectElement>)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                  disabled={usersLoading}
                  required
                >
                  <option value="">
                    {usersLoading ? 'טוען ספקים...' : 'בחר שם ספק'}
                  </option>
                  {filteredUsers.map((user: users) => (
                    <option key={user.id} value={user.id}>
                      {user.firstName + ' ' + user.lastName}
                    </option>
                  ))}
                </select>
                {usersError && (
                  <p className="mt-1 text-sm text-red-600">שגיאה בטעינת הלקוחות</p>
                )}
              </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">עד תאריך *</label>
              <input
                type="date"
                name="date"
                min={getTodayIsraelDate()}
                value={formatDateForInput(newTask.date)}
                onChange={(e) => setNewTask({ ...newTask, date: new Date(e.target.value) })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">איזור עבודה *</label>
              <select
                name="city"
                value={selectedCity}
                onChange={(e) => setSelectedCity(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                required
              >
                <option value="">בחר עיר </option>
                {TaskCities.map((city: cities, index: number) => (
                  <option key={`${city.id}-${index}`} value={city.city}>{city.city}</option>
                ))}
              </select>
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => {
                setShowAddForm(false);
                setTaskCities([]);
                setSelectedCity('');
              }}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors cursor-pointer"
            >
              ביטול
            </button>
            <button
            type="submit"
            disabled={isPending}
              className="px-4 py-2 bg-blue-600 cursor-pointer text-white rounded-md hover:bg-blue-700 transition-colors disabled:opacity-50"
            >
              {isPending ? 'טוען...' : 'הוסף משימה'}
            </button>
          </div>
        </div>
        </form>
      )}

    </div>
  );
}