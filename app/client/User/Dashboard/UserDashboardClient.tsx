'use client'

import React, { useState, useCallback, useMemo } from 'react';
import TasksTable from '@/components/TasksTable';
import { TaskFilters } from '@/types/types';
import ControlPanel from '@/components/Controlpanel';
import { Task } from '@/types/types';
import Filter from '../../Admin/tasks/Fillter';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/app/actions/fetchtasks';
import { useSession } from '@/app/client/SesstionProvider';



export default  function UserDashboardClient() {
  const session = useSession();
  const userId = session?.id ?? null;
  
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ALL',
    startDate: today,
    endDate: '',
  });

  // Use React Query for better performance, caching, and request deduplication
  const { data: tasks = [], isLoading, refetch } = useQuery<Task[]>({
    queryKey: ['tasks', 'user', userId, filters],
    queryFn: () => fetchTasks(filters),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
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

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="space-y-8">
          {/* Header section with ControlPanel and SignOutButton side by side */}
          <div className="flex justify-between items-center gap-4">
            <div className="flex-1">
              <ControlPanel  />
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
          <TasksTable 
            title="המשימות שלי" 
            tasks={tasks} 
            isLoading={isLoading}
            refetch={refetch}
          />
        </div>
      </div>
    </div>
  )
}
