"use client"


import { useMutation } from "@tanstack/react-query";
import { NewTask } from "@/types/types";


interface AddTaskProps {
  taskData: NewTask;
  userid: string;
}

const addTask = async ({taskData,userid}: AddTaskProps) => {
    const response = await fetch(`/api/ADMIN/AddTask?supplierid=${taskData.Supplier_id}&userid=${userid}`, {
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

  export const useAddTask = (setNewTask: (task: NewTask) => void, setShowAddForm: (show: boolean) => void) => 
    {
   return useMutation({
        mutationFn: ({ taskData, userid }: AddTaskProps) => addTask({taskData,userid}),
        onSuccess: () => {
          setNewTask({
            address: '',
            description: '',
            Supplier_id: null,
            date: null,
            city: '',
          });
          setShowAddForm(false);
        },
        onError: (error) => {
          console.error('Error adding task:', error);
        }
      });
  };

