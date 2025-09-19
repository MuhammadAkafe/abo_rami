import { useQuery } from "@tanstack/react-query";
import { tasks } from "@prisma/client";

const getAllTasks = async (User_id: number): Promise<tasks[]> => {
    const response = await fetch(`/api/ADMIN/GetAllTasks?userid=${User_id}`, {
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


export const useGetAllTasks = (User_id: number) => {
    const { data, isLoading, error, refetch } = useQuery({
        queryKey: ['tasks'],
        queryFn: () => getAllTasks(User_id),
        enabled: !!User_id,
    });
    return { data, isLoading, error, refetch };
}
