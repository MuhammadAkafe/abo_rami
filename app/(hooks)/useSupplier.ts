import { useQuery } from "@tanstack/react-query";
import { Suppliers } from "@prisma/client";



const getAllSuppliers = async (): Promise<Suppliers[]> => {
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