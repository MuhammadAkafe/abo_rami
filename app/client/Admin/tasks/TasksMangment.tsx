"use client"
import React, { useState, useCallback } from 'react';
import Filter from './Fillter';
import TasksTable from '../../../../components/TasksTable';
import { TaskFilters } from '@/types/types';
import {useEffect} from 'react';
import { Task } from '@/types/types';


export default function TaskManagement() {
  // Set default filter to today
  const today = new Date().toISOString().split('T')[0];
  
  const [filters, setFilters] = useState<TaskFilters>({
    status: 'ALL',
    startDate: today,
    endDate: '',
  });

  const [tasks, setTasks] = useState<Task[] | null>(null);


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
      try {
        // Build query parameters
        const params = new URLSearchParams();
        if (filters.status && filters.status !== 'ALL') {
          params.append('status', filters.status);
        }
        if (filters.startDate) {
          params.append('startDate', filters.startDate.toString());
        }
        if (filters.endDate) {
          params.append('endDate', filters.endDate.toString());
        }

        const response = await fetch(`/api/tasks/FillterTasks?${params.toString()}`);
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
  }, [filters]);





  return (
    <>
    <Filter onFiltersChange={handleFiltersChange} 
    clearFilters={clearFilters}
     filters={filters} setFilters={setFilters} />
    <TasksTable title="ניהול משימות" filters={filters} tasks={tasks as Task[]} />
    </>
  );
}