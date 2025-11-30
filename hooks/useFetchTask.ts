import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/types";
import { fetchTask } from "@/app/actions/fetchtasks";




export const useFetchTask = (id: string | string[] | undefined, enabled: boolean = true) => {
    // Ensure id is a string
    const taskId = Array.isArray(id) ? id[0] : id;

    const { data: task = null, isLoading, error,refetch } = useQuery<Task | null>({
        queryKey: ['task', taskId],
        queryFn: async () => {
            if (!taskId) {
                console.error('Task ID is missing');
                return null;
            }
            return await fetchTask(taskId);
        },
        enabled: !!taskId && enabled, // Only run query if taskId exists and enabled is true
        staleTime: 60 * 1000, // Consider data fresh for 1 minute
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        retry: 1, // Retry once for network errors (fetchTask handles 404s gracefully)
      });

    return { task, isLoading, error,refetch };
}