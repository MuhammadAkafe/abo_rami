import { useQuery } from "@tanstack/react-query";



const getAllSuppliers = async () => {
    const response = await fetch('/GetAllUsers');
    if (!response.ok) {
        throw new Error('Failed to fetch users');
    }
    return response.json();
};

export const useGetAllSuppliers = () => {
    return useQuery({
        queryKey: ['suppliers'],
        queryFn: getAllSuppliers,
    });
};