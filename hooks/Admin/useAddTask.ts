import { Task } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { addTask } from "@/app/actions/TaskActions";

const AddTask = async (newTask: Task) => {
    if (!newTask.date) {
        throw new Error('תאריך הוא שדה חובה');
    }
    
    const result = await addTask({
        address: newTask.address,
        description: newTask.description,
        supplierId: newTask.supplierId,
        date: newTask.date.toString(),
        city: newTask.city,
    });
    
    if (result.error) {
        // Map error messages to Hebrew
        let errorMessage = result.error;
        if (errorMessage.includes('Forbidden: Admin access required')) {
            errorMessage = 'אין הרשאה לבצע פעולה זו';
        } else if (errorMessage.includes('Unauthorized')) {
            errorMessage = 'אין הרשאה - נא להתחבר מחדש';
        } else if (errorMessage.includes('Supplier not found')) {
            errorMessage = 'הספק לא נמצא';
        } else if (errorMessage.includes('Invalid date') || errorMessage.includes('Date')) {
            errorMessage = 'תאריך לא תקין';
        }
        
        throw new Error(errorMessage);
    }
    
    return { success: true, message: result.message };
}

const useAddTask = (resetForm: () => void) => {
    const { mutate, isPending, error, isSuccess } = useMutation({
        mutationFn: AddTask,
        onSuccess: () => {
          console.log("Task added successfully");
         //resetForm();
        },
        onError: (error) => {
         console.log("Error adding task: " + error.message);
        },
      });
  return { mutate, isPending, error, isSuccess };
}

export default useAddTask;
