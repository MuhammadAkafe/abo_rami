import { useMutation } from "@tanstack/react-query";


const deleteTask = async (taskId: number) => {
    try {
        const response = await fetch(`/api/ADMIN/DeleteTask`, {
          method: 'DELETE',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ id: taskId }),
        });
  
        if (response.ok) {
          console.log("Task deleted successfully");
        } else {
          console.error("Error deleting task");
        }
      } catch (error) {
        console.error("Error deleting task:", error);
      }
};

export const useDeleteTask = () => {
    return useMutation({
        mutationFn: deleteTask,
    });
};



