"use client"

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";
import { useUser } from '@clerk/nextjs';


const fetchExistingCities = async (supplierId: string) => {
    try {
      const response = await fetch(`/api/GetAllCities?supplier_id=${supplierId}`);
      const data = await response.json();
      
      if (response.ok) {
        return data; // Return the actual cities data
      }
      return []; // Return empty array if no cities found
    } catch (error) {
      console.error('Error fetching existing cities:', error);
      return []; // Return empty array on error
    } 
  };


export const useGetAllCities = () => {
const router = useRouter();
const { user, isLoaded } = useUser();
const user_id = user?.id as string;

  const query = useQuery({
    queryKey: ['getAllCities', user_id],
    queryFn: () => fetchExistingCities(user_id),
    enabled: !!user_id,
  });

  useEffect(() => {
    // Only proceed if session is loaded and user is authenticated
    if (!isLoaded) {
      return; // Still loading session
    }
    
    if (!user_id) {
      return;
    }
    query.refetch();
  }, [user_id, router, isLoaded, query]);
  
  return { query };
}

