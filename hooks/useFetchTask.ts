import { useQuery } from "@tanstack/react-query";
import { Task, TaskFilters } from "@/types/types";
import { fetchTask, fetchTasks } from "@/app/actions/fetchtasks";




export const useFetchTask = (id: string) => {

    const { data: task = null, isLoading, error,refetch } = useQuery<Task | null>({
        queryKey: ['task', id],
        queryFn: async () => await fetchTask(id),
      });

    return { task, isLoading, error,refetch };
}