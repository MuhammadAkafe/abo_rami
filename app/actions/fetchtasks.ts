import { TaskFilters } from "@/types/types";


export async function fetchTasks(filters: TaskFilters) {
    const params = new URLSearchParams();
    
    if (filters.status && filters.status !== 'ALL') {
      params.append('status', filters.status);
    }
    
    if (filters.startDate && filters.startDate.toString().trim() !== '') {
      params.append('startDate', filters.startDate.toString());
    }
    
    if (filters.endDate && filters.endDate.toString().trim() !== '') {
      params.append('endDate', filters.endDate.toString());
    }
    
    const response = await fetch(`/api/tasks/FillterTasks?${params.toString()}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to fetch tasks');
      return [];
    }
  }


  export async function fetchTask(id: string) {
    const response = await fetch(`/api/tasks/${id}`);
    if (response.ok) {
      const data = await response.json();
      return data;
    } else {
      console.error('Failed to fetch task');
      return null;
    }
  }