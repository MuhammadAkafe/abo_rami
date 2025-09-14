"use client"


import { useMutation } from "@tanstack/react-query";
import { tasks } from "@prisma/client";





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

