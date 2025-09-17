"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { suppliers } from "@prisma/client";
import { NewSupplier } from "../(types)/types";

const getAllSuppliers = async (User_id: number): Promise<suppliers[]> => {
    const response = await fetch(`/api/GetAllSuppliers?userid=${User_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
    }
    return response.json();
};

export const useGetAllSuppliers = (User_id: number) => {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: () => getAllSuppliers(User_id),
    });
};




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

  export const useAddSupplier = () => {
    return useMutation({
      mutationFn: Add_Supplier,
    });
  };





