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
    try {
      if (!id) {
        console.error('Task ID is required');
        return null;
      }

      const response = await fetch(`/api/tasks/${id}`);
      
      if (!response.ok) {
        // Try to get error message from response
        let errorMessage = 'Failed to fetch task';
        try {
          const errorData = await response.json();
          errorMessage = errorData.error || errorMessage;
        } catch {
          // If response is not JSON, use status text
          errorMessage = response.statusText || errorMessage;
        }
        
        // Only log non-404 errors (404 is expected when task is deleted)
        if (response.status !== 404) {
          console.error('Failed to fetch task:', errorMessage, `Status: ${response.status}`);
        }
        return null;
      }

      // Check if response has content
      const contentType = response.headers.get('content-type');
      if (!contentType || !contentType.includes('application/json')) {
        console.error('Invalid response content type:', contentType);
        return null;
      }

      const text = await response.text();
      if (!text) {
        console.error('Empty response from server');
        return null;
      }

      try {
        const data = JSON.parse(text);
        return data;
      } catch (parseError) {
        console.error('Failed to parse JSON response:', parseError, 'Response:', text);
        return null;
      }
    } catch (error) {
      console.error('Error fetching task:', error);
      return null;
    }
  }