
import { useQuery } from "@tanstack/react-query"
import { GetSuppliers } from "@/app/actions/GetSuppliers";








export const useGetSuppliers = () => {
    const {data: suppliers, isLoading, error, refetch} = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => await GetSuppliers(),
    });
    return { suppliers, isLoading, error, refetch };
}

export default useGetSuppliers;






