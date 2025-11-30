"use client"
import { useState } from "react";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";


export default function Query_Client_Provider({ children }: { children: React.ReactNode }) 
{
    const [queryClient] = useState(() => new QueryClient({
        defaultOptions: {
          queries: {
            staleTime: 30 * 1000, // 30 seconds - data is considered fresh
            gcTime: 5 * 60 * 1000, // 5 minutes - cache time (formerly cacheTime)
            retry: 1, // Retry failed requests once
            refetchOnWindowFocus: false, // Don't refetch when window regains focus
            refetchOnMount: true, // Refetch when component mounts if data is stale
            refetchOnReconnect: true, // Refetch when network reconnects
          },
          mutations: {
            retry: 1, // Retry failed mutations once
          },
        },
      }));
  return (
    <QueryClientProvider client={queryClient}>
      {children}
    </QueryClientProvider>
  );
}