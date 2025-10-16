"use client"


import { useMutation } from "@tanstack/react-query";
import { NewTask } from "@/types/types";
import { useUser } from '@clerk/nextjs';


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
    const { user } = useUser();
    const user_id = user?.id as string;
   return useMutation({
        mutationFn: ({ taskData }: AddTaskProps) => addTask({taskData,userid: user_id}),
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

