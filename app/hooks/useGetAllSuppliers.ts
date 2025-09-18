import { suppliers } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const getAllSuppliers = async (User_id: number): Promise<suppliers[]> => {
    const response = await fetch(`/api/ADMIN/GetAllSuppliers?userid=${User_id}`, {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
    });
    if (!response.ok) {
        throw new Error('Failed to fetch suppliers');
    }
    return response.json();
};

export const useGetAllSuppliers = (User_id: number) => {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: () => getAllSuppliers(User_id),
    });
};
