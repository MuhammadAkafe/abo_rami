"use client";

import LoadingComponent from "@/app/components/Loading/LoadingComponent";
import { useGetAllCities } from "@/hooks/UseGetAllCities";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function Loading() {
  const { query } = useGetAllCities();
  const router = useRouter();

  useEffect(() => {
    // Check if the query has completed and we have data
    if (query.isSuccess && query.data !== undefined) {
      // If supplier has cities (data.length > 0), redirect to TaskList
      if (query.data.length > 0) {
        router.push('/USER/Tasklist');
      } else {
        // If supplier has no cities, redirect to AddCities
        router.push('/USER/AddCitties');
      }
    }
  }, [query.isSuccess, query.data, router]);

  // Determine the appropriate message based on query state
  const getLoadingMessage = () => {
    if (query.isLoading) {
      return "טוען נתונים...";
    }
    if (query.isError) {
      return "שגיאה בטעינת הנתונים - מנסה שוב...";
    }
    if (query.isSuccess && query.data !== undefined) {
      if (query.data.length > 0) {
        return "מעביר אותך לרשימת המשימות...";
      } else {
        return "מעביר אותך לבחירת ערים...";
      }
    }
    return "טוען נתונים...";
  };

  // Handle error state with retry
  useEffect(() => {
    if (query.isError) {
      // Retry after 3 seconds
      const timer = setTimeout(() => {
        query.refetch();
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [query.isError, query]);

  return ( 
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoadingComponent message={getLoadingMessage()} />
      </div>
    </div>
  );
}
