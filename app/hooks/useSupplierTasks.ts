import { useState, useEffect } from 'react';
import { tasks } from '@prisma/client';

// Type definitions
export type TaskWithSupplier = tasks & {
  supplier?: {
    firstName: string;
    lastName: string;
    phone: string;
  } | null;
};

export interface UseSupplierTasksReturn {
  tasks: TaskWithSupplier[];
  loading: boolean;
  error: string | null;
}

/**
 * Custom hook for fetching supplier tasks
 * @param supplierId - The ID of the supplier
 * @returns Object containing tasks, loading state, and error state
 */
export const useSupplierTasks = (supplierId: number): UseSupplierTasksReturn => {
  const [tasks, setTasks] = useState<TaskWithSupplier[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchTasks = async () => {
      if (!supplierId) {
        setLoading(false);
        return;
      }
      
      try {
        setLoading(true);
        setError(null);
        
        const response = await fetch(`/api/Supplier/GetSupplierTasks?supplierId=${supplierId}`);
        
        if (!response.ok) {
          throw new Error(`Failed to fetch tasks: ${response.status}`);
        }
        
        const data = await response.json();
        setTasks(data);
      } catch (err) {
        const errorMessage = err instanceof Error ? err.message : 'Failed to fetch tasks';
        setError(errorMessage);
        console.error('Error fetching supplier tasks:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchTasks();
  }, [supplierId]);

  return { tasks, loading, error };
};
