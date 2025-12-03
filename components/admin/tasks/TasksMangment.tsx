"use client"
import React, { useState, useCallback, useMemo } from 'react';
import Filter from './Fillter';
import TasksTable from '../../packages/TasksTable';
import { TaskFilters } from '@/types/types';
import { Task } from '@/types/types';
import { useQuery } from '@tanstack/react-query';
import { fetchTasks } from '@/app/actions/fetchtasks';
import { useSession } from '@/app/client/SesstionProvider';
import * as XLSX from 'xlsx';

export default function TaskManagement() {
  const session = useSession();
  const userId = session?.id ?? null;
  
  // Memoize today's date to avoid recalculation on every render
  const today = useMemo(() => new Date().toISOString().split('T')[0], []);
  
  const [filters, setFilters] = useState<TaskFilters>(() => ({
    status: 'ALL',
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  }));
  const { data: tasks = [], isLoading,refetch } = useQuery<Task[]>({
    queryKey: ['tasks', 'admin', userId, filters],
    queryFn: () => fetchTasks(filters),
    staleTime: 30 * 1000, // Consider data fresh for 30 seconds
    gcTime: 5 * 60 * 1000, // Keep in cache for 5 minutes
    refetchOnWindowFocus: false, // Don't refetch on window focus for better UX
  });

  // Export tasks to Excel
  const exportToExcel = useCallback(() => {
    if (!tasks || tasks.length === 0) {
      alert('אין משימות לייצוא');
      return;
    }

    // Helper function to format date
    const formatDate = (date: Date | string | undefined): string => {
      if (!date) return '';
      try {
        const dateObj = typeof date === 'string' ? new Date(date) : date;
        if (isNaN(dateObj.getTime())) return '';
        return dateObj.toLocaleDateString('he-IL');
      } catch {
        return '';
      }
    };

    // Format data for Excel
    const excelData = tasks.map((task:Task) => {
      return {
        'מספר ספק': task.supplier?.id || '',
        'מספר משימה': task.id || '',
        'שם ספק': `${task.supplier?.firstName || ''} ${task.supplier?.lastName || ''}`.trim(),
        'כתובת': task.address,
        'תיאור': task.description,
        'עיר': task.city,
        'מספר טלפון': task.supplier?.phone || '',
        'תאריך': formatDate(task.date),
        'סטטוס': task.status === 'PENDING' ? 'ממתין' : 
                 task.status === 'COMPLETED' ? 'הושלם' : 
                 task.status === 'REJECTED' ? 'נדחה' : task.status || '',
      };
    });

    // Create workbook and worksheet
    const ws = XLSX.utils.json_to_sheet(excelData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'משימות');

    // Generate filename with current date
    const fileName = `משימות_${new Date().toISOString().split('T')[0]}.xlsx`;

    // Write and download
    XLSX.writeFile(wb, fileName);
  }, [tasks]);

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
        refetch={refetch}
        tasks={tasks as Task[]} 
        isLoading={isLoading}
        onExport={exportToExcel}
      />
    </>
  );
}