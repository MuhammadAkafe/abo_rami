"use client"

import { Session } from "next-auth";
import { useSession } from "next-auth/react";
import { useEffect } from "react";
import { useRouter } from "next/navigation";
import { useQuery } from "@tanstack/react-query";

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
const { data: session, status } = useSession() as { data: Session | null; status: string };
const supplierId = session?.user?.id;

  const query = useQuery({
    queryKey: ['getAllCities', supplierId],
    queryFn: () => fetchExistingCities(supplierId as string),
    enabled: !!supplierId,
  });

  useEffect(() => {
    // Only proceed if session is loaded and user is authenticated
    if (status === 'loading') {
      return; // Still loading session
    }
    
    if (status === 'unauthenticated' || !supplierId) {
      return;
    }
    query.refetch();
  }, [supplierId, router, status, query]);
  
  return { query };
}

