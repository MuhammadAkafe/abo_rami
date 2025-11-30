"use client"

import { useMutation, useQueryClient } from "@tanstack/react-query";
import { NewSupplier } from "@/types/types";
import { addSupplier } from "@/app/actions/SupplierActions";

const Add_Supplier = async (formData: NewSupplier) => {
    try {
      const result = await addSupplier(formData);
      
      if (result.error) {
        // Map error messages to Hebrew
        let errorMessage = result.error;
        if (errorMessage.includes('Forbidden: Admin access required')) {
          errorMessage = 'אין הרשאה לבצע פעולה זו';
        } else if (errorMessage.includes('Unauthorized')) {
          errorMessage = 'אין הרשאה - נא להתחבר מחדש';
        } else if (errorMessage.includes('Supplier with this email already exists') || 
                   errorMessage.includes('already exists')) {
          errorMessage = 'משתמש עם כתובת אימייל זו כבר קיים במערכת.';
        } else if (errorMessage.includes('Missing required fields')) {
          errorMessage = 'חסרים שדות חובה: שם פרטי, שם משפחה, אימייל וסיסמה.';
        } else if (errorMessage.includes('User not found')) {
          errorMessage = 'משתמש לא נמצא';
        }
        
        throw new Error(errorMessage);
      }
      
      return result;
    } catch (error) {
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
