"use client"

import React, { useState } from 'react';
import TasksTable from '@/components/TasksTable';
import { useUser } from '@clerk/nextjs';
import { TaskFilters } from '@/types/types';
import ControlPanel from '@/components/Controlpanel';
import { Task } from '@/types/types';
import { useEffect, useCallback } from 'react';
import Filter from '../../Admin/tasks/Fillter';


export default function UserDashboard() {
  const { user, isLoaded } = useUser();
  const [tasks, setTasks] = useState<Task[]>([]);
  const clerkId = user?.id as string;



  const today = new Date().toISOString().split('T')[0];
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ALL',
    startDate: today,
    endDate: '',
  });



  const clearFilters = useCallback(() => {
    const clearedFilters: TaskFilters = {
      status: 'ALL',
      startDate: today,
      endDate: ''
    };
    setFilters(clearedFilters);
  }, [today]);




  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);




  useEffect(() => {
    const fetchTasks = async () => {
      if (!clerkId || !isLoaded) return;
      
      try {
        const params = new URLSearchParams({
          clerkId: clerkId,
          status: filters.status,
          startDate: filters.startDate.toString(),
          endDate: filters.endDate.toString(),
        });

        
        const response = await fetch(`/api/USER/FillterTasks?${params}`);
        if (response.ok) {
          const data = await response.json();
          setTasks(data);
        } else {
          console.error('Failed to fetch tasks');
        }
      } catch (error) {
        console.error('Error fetching tasks:', error);
      }
    };
    
    fetchTasks();
  }, [filters, clerkId, isLoaded]);















  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header section with ControlPanel and SignOutButton side by side */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <ControlPanel isAdmin={false} />
            </div>
          </div>
        </div>
      </div>

      {/* Filter section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <Filter onFiltersChange={handleFiltersChange} 
    clearFilters={clearFilters}
     filters={filters} setFilters={setFilters} />
      </div>

      {/* Tasks section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          <TasksTable title="המשימות שלי" tasks={tasks} />
        </div>
      </div>
    </div>
  )
}