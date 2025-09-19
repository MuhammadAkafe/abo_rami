import { useQuery } from "@tanstack/react-query";
import { tasks } from "@prisma/client";
import { TaskFilters } from "@/app/(types)/types";

const getAllTasks = async (User_id: number, filters?: TaskFilters): Promise<tasks[]> => {
    const params = new URLSearchParams({
        userid: User_id.toString()
    });

    if (filters) {
        if (filters.status) params.append('status', filters.status);
        if (filters.startDate) params.append('startDate', filters.startDate);
        if (filters.endDate) params.append('endDate', filters.endDate);
    }

    const response = await fetch(`/api/ADMIN/GetAllTasks?${params.toString()}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch tasks');
    }
    return response.json();
}


export const useGetAllTasks = (User_id: number, filters?: TaskFilters) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks', filters],
        queryFn: () => getAllTasks(User_id, filters),
        enabled: !!User_id,
    });
    return { data, isLoading, error, refetch };
}
