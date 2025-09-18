"use client"

import { useMutation } from "@tanstack/react-query";
import { NewSupplier } from "../(types)/types";



const Add_Supplier = async (formData: NewSupplier) => {
    const response = await fetch('/api/AddSupplier', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Add Supplier failed');
    }
    
    return response.json();
  };

  export const useAddSupplier = () => 
    
    {
    return useMutation({
      mutationFn: Add_Supplier,
    });
  };





