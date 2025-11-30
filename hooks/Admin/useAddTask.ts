import { Task } from "@/types/types";
import { useMutation } from "@tanstack/react-query";
import { API_ROUTES } from "@/app/constans/constans";
const AddTask = async (newTask: Task) => {
    const response = await fetch(API_ROUTES.ADMIN.ADD_TASK, {
      method: "POST",
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(newTask),
    });
    
    if (!response.ok) {
      // Try to get error message from response
      let errorData: { message?: string } = {};
      let errorMessage = 'Add Task failed';
      
      try {
        // Check if response has content
        const contentType = response.headers.get('content-type');
        if (contentType && contentType.includes('application/json')) {
          const text = await response.text();
          if (text) {
            errorData = JSON.parse(text);
          }
        }
      } catch (parseError) {
        // If parsing fails, use status text
        console.warn('Failed to parse error response:', parseError);
      }
      
      // Get error message from response or use status text
      if (errorData && errorData.message) {
        errorMessage = errorData.message;
      } else if (response.statusText) {
        errorMessage = response.statusText;
      } else {
        // Default messages based on status code
        switch (response.status) {
          case 400:
            errorMessage = 'שגיאה בנתונים שנשלחו';
            break;
          case 401:
            errorMessage = 'אין הרשאה - נא להתחבר מחדש';
            break;
          case 403:
            errorMessage = 'אין הרשאה לבצע פעולה זו';
            break;
          case 500:
            errorMessage = 'שגיאת שרת - אנא נסה שוב מאוחר יותר';
            break;
          default:
            errorMessage = `שגיאה ${response.status}: נכשל בהוספת המשימה`;
        }
      }
      
      console.error('API Error Response:', { 
        status: response.status, 
        statusText: response.statusText,
        errorData 
      });
      
      throw new Error(errorMessage);
    }
    
    const data = await response.json();
    return data;
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