"use client"

import { useMutation, useQuery } from "@tanstack/react-query";
import { users } from "@prisma/client";
import { RegisterFormData } from "../validtion";

const getAllSuppliers = async (): Promise<users[]> => {
    const response = await fetch('/api/GetAllUsers', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const useGetAllSuppliers = () => {
    return useQuery({
        queryKey: ['users'],
        queryFn: getAllSuppliers,
    });
};




const register = async (formData: RegisterFormData) => {
    const response = await fetch('/api/auth/register', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(formData),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.error || errorData.message || 'Registration failed');
    }
    
    return response.json();
  };

  export const useRegister = () => {
    return useMutation({
      mutationFn: register,
    });
  };





