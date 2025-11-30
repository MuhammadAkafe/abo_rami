import { useQuery } from "@tanstack/react-query";
import { Task } from "@/types/types";
import { fetchTask } from "@/app/actions/fetchtasks";




export const useFetchTask = (id: string | string[] | undefined) => {
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
        enabled: !!taskId, // Only run query if taskId exists
      });

    return { task, isLoading, error,refetch };
}