"use client"
import React from 'react';
import TasksTable from '../TasksTable/TasksTable';
import { TaskFilters } from '@/app/(types)/types';

export default function TasksDashbaordDisplay() {
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

  const todayIsrael = getTodayIsraelDate();
  
  // Force today's tasks only by setting specific filters
  const todayFilters: TaskFilters = {
    status: 'all', // Show all statuses for today
    startDate: todayIsrael, // Today's date in Israel timezone
    endDate: todayIsrael // Today's date in Israel timezone
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


