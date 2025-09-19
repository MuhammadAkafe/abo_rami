"use client"
import React from 'react';
import TasksTable from './TasksTable';
import { TaskFilters } from '@/app/(types)/types';

export default function TasksDashbaordDisplay() {
  // Force today's tasks only by setting specific filters
  const todayFilters: TaskFilters = {
    status: 'all', // Show all statuses for today
    startDate: new Date().toISOString().split('T')[0], // Today's date
    endDate: new Date().toISOString().split('T')[0] // Today's date
  };

  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      <TasksTable 
        title="משימות היום" 
        showDeleteButton={false} 
        filters={todayFilters}
      />
    </div>
  )
}


