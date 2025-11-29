"use client"
import React, { useState, useCallback, useMemo } from 'react';
import Filter from './Fillter';
import TasksTable from '../../../../components/TasksTable';
import { TaskFilters } from '@/types/types';
import { Task } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/app/actions/fetchtasks';
export default function TaskManagement() {
  // Memoize today's date to avoid recalculation on every render
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const [filters, setFilters] = useState<TaskFilters>(() => ({
    status: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  }));
  const { data: tasks = [], isLoading,refetch } = useQuery<Task[]>({
    queryKey: ['tasks', filters],
    queryFn: () => fetchTasks(filters),
  });


  const clearFilters = useCallback(() => {
    setFilters({
      status: 'ALL',
      startDate: today,
      endDate: ''
    });
  }, [today]);




  const handleFiltersChange = useCallback((newFilters: TaskFilters) => {
    setFilters(newFilters);
  }, []);





  return (
    <>
      <Filter 
        onFiltersChange={handleFiltersChange} 
        clearFilters={clearFilters}
        filters={filters} 
        setFilters={setFilters} 
      />
      <TasksTable 
        title="ניהול משימות" 
        filters={filters} 
        refetch={() => refetch()}
        tasks={tasks as Task[]} 
        isLoading={isLoading} 
      />
    </>
  );
}