"use client"


import { useMutation, useQuery } from "@tanstack/react-query";
import { tasks } from "@prisma/client";

interface TaskFilters {
    status?: string;
    priority?: string;
    startDate?: string;
    endDate?: string;
}

const getTasks = async (filters?: TaskFilters) => {
    const params = new URLSearchParams();
    
    if (filters?.status && filters.status !== 'all') {
        params.append('status', filters.status);
    }
    if (filters?.priority && filters.priority !== 'all') {
        params.append('priority', filters.priority);
    }
    if (filters?.startDate) {
        params.append('startDate', filters.startDate);
    }
    if (filters?.endDate) {
        params.append('endDate', filters.endDate);
    }
    
    const queryString = params.toString();
    const url = queryString ? `/get_all_tasks?${queryString}` : '/get_all_tasks';
    
    const response = await fetch(url);
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    const result = await response.json();
    return result;
};

export const useGetTask = (filters?: TaskFilters) => {
    return useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => getTasks(filters),
    });
};



const addTask = async (taskData: Partial<tasks>) => {
    const response = await fetch('/addTask', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(taskData),
    });
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.error || 'שגיאה בהוספת המשימה');
    }
    
    return result;
  };

  export const useAddTask = (setNewTask: (task: Partial<tasks>) => void, setShowAddForm: (show: boolean) => void) => {
   return useMutation({
        mutationFn: addTask,
        onSuccess: () => {
          setNewTask({
            address: '',
            description: '',
            priority: undefined,
            supplierId: undefined,
          });
          setShowAddForm(false);
        },
        onError: (error) => {
          console.error('Error adding task:', error);
        }
      });
  };

