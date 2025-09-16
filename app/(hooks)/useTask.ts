"use client"


import { useMutation } from "@tanstack/react-query";
import { tasks } from "@prisma/client";
import { NewTask } from "@/app/(types)/types";




const addTask = async (taskData: NewTask) => {
    const response = await fetch('/api/router/addTask', {
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

  export const useAddTask = (setNewTask: (task: NewTask) => void, setShowAddForm: (show: boolean) => void) => {
   return useMutation({
        mutationFn: addTask,
        onSuccess: () => {
          setNewTask({
            address: '',
            description: '',
            userid: null,
            date: null,
            taskArea: '',
          });
          setShowAddForm(false);
        },
        onError: (error) => {
          console.error('Error adding task:', error);
        }
      });
  };

