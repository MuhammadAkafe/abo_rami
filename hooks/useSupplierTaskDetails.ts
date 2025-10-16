import { useState, useEffect } from 'react';
import { suppliers, tasks, Status } from '@prisma/client';
import { useUser } from '@clerk/nextjs';

// Type definitions
export type TaskWithSupplier = tasks & {
  supplier?: {
    firstName: string;
    lastName: string;
    phone: string;
    email: string;
  } | null;
};

export type SupplierWithUser = suppliers & {
  user: {
    firstName: string;
    lastName: string;
    email: string;
  };
};

export interface UseSupplierTaskDetailsReturn {
  task: TaskWithSupplier | null;
  supplier: SupplierWithUser | null;
  loading: boolean;
  error: string | null;
  isEditingStatus: boolean;
  newStatus: Status;
  statusUpdateLoading: boolean;
  setIsEditingStatus: (value: boolean) => void;
  setNewStatus: (value: Status) => void;
  handleEditStatus: () => void;
  handleCancelEdit: () => void;
  handleStatusUpdate: () => Promise<void>;
  handleSignatureUpdate: (signatureData: string) => Promise<void>;
}

/**
 * Custom hook for managing supplier task details
 * @param taskId - The ID of the task
 * @param supplierId - The ID of the supplier
 * @returns Object containing task data, loading states, and handlers
 */
export const useSupplierTaskDetails = (
  taskId: string | null,
  supplierId: string | null
): UseSupplierTaskDetailsReturn => {

  const { user } = useUser();
  const user_id = user?.id as string;
  // State management
  const [task, setTask] = useState<TaskWithSupplier | null>(null);
  const [supplier, setSupplier] = useState<SupplierWithUser | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isEditingStatus, setIsEditingStatus] = useState(false);
  const [newStatus, setNewStatus] = useState<Status>('PENDING');
  const [statusUpdateLoading, setStatusUpdateLoading] = useState(false);

  // Fetch data on component mount
  useEffect(() => {
    const fetchData = async () => {
      // Validate required parameters
      if (!taskId || !supplierId || !user_id) {
        setError('Missing required parameters');
        setLoading(false);
        return;
      }

      // Validate taskId is a valid number
      const parsedTaskId = parseInt(taskId);
      if (isNaN(parsedTaskId)) {
        setError('Invalid task ID');
        setLoading(false);
        return;
      }

      try {
        setError(null); // Clear any previous errors
        const currentSupplierId = supplierId; // Use the supplierId from URL parameters
        
        // Fetch task details
        const taskResponse = await fetch(`/api/Supplier/GetSupplierTasks?supplierId=${currentSupplierId}`);
        
        if (!taskResponse.ok) {
          const errorText = await taskResponse.text();
          throw new Error(`Failed to fetch tasks: ${taskResponse.status} - ${errorText}`);
        }
        
        const tasksData = await taskResponse.json();
        
        if (!Array.isArray(tasksData)) {
          console.error('Tasks data is not an array:', tasksData);
          setError('Invalid tasks data format');
          setLoading(false);
          return;
        }
        
        const foundTask = tasksData.find((t: TaskWithSupplier) => t.id === parsedTaskId);
        
        if (!foundTask) {
          setError('Task not found');
          setLoading(false);
          return;
        }
        
        setTask(foundTask);

        // Fetch supplier details
        const supplierResponse = await fetch(`/api/Supplier/GetSupplier?supplierId=${currentSupplierId}`);
        
        if (!supplierResponse.ok) {
          const errorText = await supplierResponse.text();
          throw new Error(`Failed to fetch supplier: ${supplierResponse.status} - ${errorText}`);
        }
        
        const suppliersData = await supplierResponse.json();
        
        if (!Array.isArray(suppliersData)) {
          console.error('Suppliers data is not an array:', suppliersData);
          setError('Invalid suppliers data format');
          setLoading(false);
          return;
        }

        const parsedSupplierId = parseInt(supplierId);
        const foundSupplier = suppliersData.find((s: SupplierWithUser) => s.id === parsedSupplierId);

        if (!foundSupplier) {
          setError('Supplier not found');
          setLoading(false);
          return;
        }

        setSupplier(foundSupplier);
      } catch (err) {
        console.error('Error fetching data:', err);
        const errorMessage = err instanceof Error ? err.message : 'Failed to load data';
        setError(errorMessage);
      } finally {
        setLoading(false);
      }
    };

    if (user_id) {
      fetchData();
    }
  }, [taskId, supplierId, user_id]);

  // Status update handler
  const handleStatusUpdate = async () => {
    if (!task || !newStatus || !user_id) {
      console.warn('Cannot update status: missing required data');
      return;
    }

    // Validate status value
    const validStatuses: Status[] = ['PENDING', 'COMPLETED', 'REJECTED'];
    if (!validStatuses.includes(newStatus)) {
      setError('Invalid status value');
      return;
    }

    setStatusUpdateLoading(true);
    setError(null); // Clear any previous errors
    
    try {
      const response = await fetch('/api/Supplier/EditTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          status: newStatus,
          supplierId: user_id
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to update status: ${response.status}`);
      }

      const result = await response.json();
      
      // Update the local task state
      setTask(prev => prev ? { ...prev, status: newStatus } : null);
      
      // Reset editing state
      setIsEditingStatus(false);
      setNewStatus('PENDING');
      
      console.log('Status updated successfully:', result);
      
    } catch (err) {
      console.error('Error updating status:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update status';
      setError(errorMessage);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  // Edit status handler
  const handleEditStatus = () => {
    if (task) {
      setNewStatus(task.status || 'PENDING');
      setIsEditingStatus(true);
    }
  };

  // Cancel edit handler
  const handleCancelEdit = () => {
    setIsEditingStatus(false);
    setNewStatus('PENDING');
  };

  // Signature update handler
  const handleSignatureUpdate = async (signatureData: string) => {
    if (!task || !user_id) {
      console.warn('Cannot update signature: missing required data');
      return;
    }

    setStatusUpdateLoading(true);
    setError(null);
    
    try {
      const response = await fetch('/api/Supplier/EditTask', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          taskId: task.id,
          supplierId: user_id,
          imageUrl: signatureData
        }),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({ error: 'Unknown error' }));
        throw new Error(errorData.error || `Failed to update signature: ${response.status}`);
      }

      const result = await response.json();
      
      // Update the local task state
      setTask(prev => prev ? { ...prev, url: signatureData } : null);
      
      console.log('Signature updated successfully:', result);
      
    } catch (err) {
      console.error('Error updating signature:', err);
      const errorMessage = err instanceof Error ? err.message : 'Failed to update signature';
      setError(errorMessage);
    } finally {
      setStatusUpdateLoading(false);
    }
  };

  return {
    task,
    supplier,
    loading,
    error,
    isEditingStatus,
    newStatus,
    statusUpdateLoading,
    setIsEditingStatus,
    setNewStatus,
    handleEditStatus,
    handleCancelEdit,
    handleStatusUpdate,
    handleSignatureUpdate,
  };
};
