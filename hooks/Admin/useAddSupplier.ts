"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewSupplier } from "@/types/types";;



const Add_Supplier = async (formData: NewSupplier) => 
  {
    try {
      const response = await fetch('/api/ADMIN/AddSupplier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      console.error('API Error Response:', errorData);
      
      // Handle specific error messages
      let errorMessage = errorData.message || 'Add Supplier failed';
      
      // Handle Clerk-specific errors
      if (errorData.message && errorData.message.includes('Password has been found in an online data breach')) {
        errorMessage = 'הסיסמה שנבחרה נמצאה בפריצת נתונים. אנא בחר סיסמה חזקה יותר.';
      } else if (errorData.message && errorData.message.includes('User already exists')) {
        errorMessage = 'משתמש עם כתובת אימייל זו כבר קיים במערכת.';
      } else if (errorData.message && errorData.message.includes('Invalid email')) {
        errorMessage = 'כתובת האימייל אינה תקינה.';
      } else if (errorData.message && errorData.message.includes('Password')) {
        errorMessage = 'הסיסמה אינה עומדת בדרישות הבטיחות.';
      } else if (errorData.message && errorData.message.includes('Database connection failed')) {
        errorMessage = 'שגיאת חיבור למסד הנתונים. אנא נסה שוב מאוחר יותר.';
      } else if (errorData.message && errorData.message.includes('Network error')) {
        errorMessage = 'שגיאת רשת. אנא בדוק את החיבור שלך ונסה שוב.';
      } else if (errorData.message && errorData.message.includes('Clerk error')) {
        errorMessage = 'שגיאה במערכת האימות. אנא נסה שוב.';
      }
      
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
