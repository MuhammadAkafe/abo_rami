import { suppliers } from "@prisma/client";
import { useQuery } from "@tanstack/react-query";

const getAllSuppliers = async (User_id: string): Promise<suppliers[]> => {
    try {
        console.log('useGetAllSuppliers: Fetching suppliers for user:', User_id);
        
        const response = await fetch(`/api/ADMIN/GetAllSuppliers?userid=${User_id}`, {
            method: 'GET',
            headers: {
                'Content-Type': 'application/json',
            },
        });
        
        console.log('useGetAllSuppliers: Response status:', response.status);
        
        if (!response.ok) {
            const errorData = await response.json().catch(() => ({}));
            console.error('useGetAllSuppliers: API Error:', {
                status: response.status,
                statusText: response.statusText,
                errorData
            });
            throw new Error(`Failed to fetch suppliers: ${response.status} ${response.statusText}`);
        }
        
        const data = await response.json();
        console.log('useGetAllSuppliers: Received data:', data);
        return data;
    } catch (error) {
        console.error('useGetAllSuppliers: Fetch error:', error);
        throw error;
    }
};

export const useGetAllSuppliers = (User_id: string) => {
    return useQuery({
        queryKey: ['suppliers', User_id],
        queryFn: () => getAllSuppliers(User_id),
        enabled: !!User_id, // Only run query when User_id is available
    });
};
