import { getSuppliers } from "@/app/actions/supplierActions";
import { useQuery } from "@tanstack/react-query"









export const useGetSuppliers = (AdminId: string) => {
    const {data: suppliers, isLoading, error, refetch} = useQuery({
        queryKey: ['suppliers'],
        queryFn: async () => await getSuppliers(AdminId),
        enabled: !!AdminId,
    });
    return { suppliers, isLoading, error, refetch };
}

export default useGetSuppliers;






