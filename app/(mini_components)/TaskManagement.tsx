"use client"
import React, { useState } from 'react';
import { tasks } from '@/generated/prisma/client';
import { getPriorityColor, getPriorityText, getStatusColor, getStatusText } from '../styles/taskstyles';

interface TaskManagementProps {
  tasks?: Partial<tasks>[] | null;
}

export default function TaskManagement({ tasks = [] }: TaskManagementProps) {
  const [showAddForm, setShowAddForm] = useState(false);
  const [newTask, setNewTask] = useState({
    address: '',
    description: '',
    priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH',
    status: 'PENDING' as 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED',
    customerName: ''
  });

  const handleAddTask = () => {
    // Here you would typically call an API to add the task
    console.log('Adding task:', newTask);
    setNewTask({ address: '', description: '', priority: 'MEDIUM' as 'LOW' | 'MEDIUM' | 'HIGH', status: 'PENDING' as 'ALL' | 'PENDING' | 'COMPLETED' | 'REJECTED', customerName: '' });
    setShowAddForm(false);
  };

  const handleDeleteTask = (taskId: string) => {
    // Here you would typically call an API to delete the task
    console.log('Deleting task:', taskId);
  };

  const handleUpdateTask = (taskId: string, updates: Partial<tasks>) => {
    // Here you would typically call an API to update the task
    console.log('Updating task:', taskId, updates);
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">ניהול משימות</h2>
        <button
          onClick={() => setShowAddForm(!showAddForm)}
          className="bg-blue-600 text-white px-4 py-2 rounded-md hover:bg-blue-700 transition-colors"
        >
          {showAddForm ? 'ביטול' : 'הוסף משימה חדשה'}
        </button>
      </div>

      {/* Add Task Form */}
      {showAddForm && (
        <div className="bg-gray-50 rounded-lg p-6 mb-6">
          <h3 className="text-lg font-semibold text-gray-900 mb-4">הוסף משימה חדשה</h3>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">כתובת</label>
              <input
                type="text"
                value={newTask.address}
                onChange={(e) => setNewTask({ ...newTask, address: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס כתובת"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">תיאור</label>
              <input
                type="text"
                value={newTask.description}
                onChange={(e) => setNewTask({ ...newTask, description: e.target.value })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                placeholder="הכנס תיאור"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
              <select
                value={newTask.priority}
                onChange={(e) => setNewTask({ ...newTask, priority: e.target.value as 'LOW' | 'MEDIUM' | 'HIGH' })}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              >
                <option value="LOW">נמוכה</option>
                <option value="MEDIUM">בינונית</option>
                <option value="HIGH">גבוהה</option>
              </select>
            </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">שם לקוח</label>
                <select
                  value={newTask.customerName}
                  onChange={(e) => setNewTask({ ...newTask, customerName: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">בחר שם לקוח</option>
                  <option value="מוחמד מרגישים">מוחמד מרגישים</option>
                  <option value="אחמד מרגישים">אחמד מרגישים</option>
                </select>
              </div>
          </div>
          <div className="mt-4 flex justify-end space-x-3">
            <button
              onClick={() => setShowAddForm(false)}
              className="px-4 py-2 text-gray-600 border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
            >
              ביטול
            </button>
            <button
              onClick={handleAddTask}
              className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              הוסף משימה
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
