"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewSupplier } from "@/types/types";;
import { API_ROUTES } from "@/app/constans/constans";


const Add_Supplier = async (formData: NewSupplier) => 
  {
    try {
      const response = await fetch(API_ROUTES.ADMIN.ADD_SUPPLIER, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      // Try to get error message from response
      let errorData: { message?: string } = {};
      let errorMessage = 'Add Supplier failed';
      
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
          case 404:
            errorMessage = 'המשאב המבוקש לא נמצא';
            break;
          case 500:
            errorMessage = 'שגיאת שרת - אנא נסה שוב מאוחר יותר';
            break;
          default:
            errorMessage = `שגיאה ${response.status}: נכשל בהוספת הספק`;
        }
      }
      
      // Handle specific error messages
      if (errorMessage.includes('Supplier with this email already exists') || 
          errorMessage.includes('User already exists') ||
          errorMessage.includes('already exists')) {
        errorMessage = 'משתמש עם כתובת אימייל זו כבר קיים במערכת.';
      } else if (errorMessage.includes('Invalid email') || 
                 errorMessage.includes('email')) {
        errorMessage = 'כתובת האימייל אינה תקינה.';
      } else if (errorMessage.includes('Password') || 
                 errorMessage.includes('password')) {
        errorMessage = 'הסיסמה אינה עומדת בדרישות הבטיחות.';
      } else if (errorMessage.includes('Database connection failed') ||
                 errorMessage.includes('Database')) {
        errorMessage = 'שגיאת חיבור למסד הנתונים. אנא נסה שוב מאוחר יותר.';
      } else if (errorMessage.includes('Network error') ||
                 errorMessage.includes('Network')) {
        errorMessage = 'שגיאת רשת. אנא בדוק את החיבור שלך ונסה שוב.';
      } else if (errorMessage.includes('Missing required fields')) {
        errorMessage = 'חסרים שדות חובה: שם פרטי, שם משפחה, אימייל וסיסמה.';
      }
      
      console.error('API Error Response:', { 
        status: response.status, 
        statusText: response.statusText,
        errorData 
      });
      
      throw new Error(errorMessage);
    }
    return response.json();
    }
    catch (error) {
      console.error('Add_Supplier error:', error);
      if (error instanceof Error) {
        throw error;
      }
      throw new Error('An unexpected error occurred while adding supplier');
    }
  };

  export const useAddSupplier = () => 
  {
    const queryClient = useQueryClient();
    
    const mutation = useMutation({
      mutationFn: Add_Supplier,
      onSuccess: () => 
        {
         console.log('Supplier added successfully');
         // Invalidate and refetch suppliers query
         queryClient.invalidateQueries({ queryKey: ['suppliers'] });
        },
      onError: (error) => {
       console.log("Error adding supplier: " + error.message);
      },
    });
    return { mutation: mutation };
  };
