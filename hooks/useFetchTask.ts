import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/types";
import { fetchTask } from "@/app/actions/tasks/fetchtasks";




export const useFetchTask = (id: string | string[] | undefined, enabled: boolean = true) => {
    // Ensure id is a string
    const taskId = Array.isArray(id) ? id[0] : id;

    const { data: task = null, isLoading, error, refetch, isError } = useQuery<Task | null>({
        queryKey: ['task', taskId],
        queryFn: async () => {
            if (!taskId) {
                throw new Error('Task ID is missing');
            }
            const result = await fetchTask(taskId);
            // If result is null, throw an error so React Query treats it as an error state
            if (result === null) {
                throw new Error('Task not found or access denied');
            }
            return result;
        },
        enabled: !!taskId && enabled, // Only run query if taskId exists and enabled is true
        staleTime: 60 * 1000, // Consider data fresh for 1 minute
        gcTime: 10 * 60 * 1000, // Keep in cache for 10 minutes
        refetchOnWindowFocus: false, // Don't refetch on window focus
        refetchOnMount: false, // Don't refetch on mount if data exists
        refetchOnReconnect: false, // Don't refetch on reconnect
        retry: false, // Don't retry - if task is not found or access denied, don't keep trying
    });

    return { task, isLoading, error, refetch, isError };
}