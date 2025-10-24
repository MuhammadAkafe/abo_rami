import { Task } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
const AddTask = async (newTask: Task) => {
    const response = await fetch("/api/ADMIN/AddTask", {
      method: "POST",
      body: JSON.stringify(newTask),
    });
    if (!response.ok) {
        throw new Error(response.statusText);
    }
    const data = await response.json();
    return data;
  }
  



const useAddTask = (resetForm: () => void) => {
    const { mutate, isPending, error, isSuccess } = useMutation({
        mutationFn: AddTask,
        onSuccess: () => {
          console.log("Task added successfully");
         resetForm();
        },
        onError: (error) => {
         console.log("Error adding task: " + error.message);
        },
      });
  return { mutate, isPending, error, isSuccess };
}

export default useAddTask;