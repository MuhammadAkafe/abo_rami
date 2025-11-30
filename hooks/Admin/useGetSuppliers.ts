
import { useQuery } from "@tanstack/react-query"
import { GetSuppliers } from "@/app/actions/GetSuppliers";
import { useSession } from "@/app/client/SesstionProvider";






export const useGetSuppliers = () => {
    const session = useSession();
    const userId = session?.id ?? null;
    
    const {data: suppliers, isLoading, error, refetch} = useQuery({
        queryKey: ['suppliers', userId],
        queryFn: async () => await GetSuppliers(),
    });
    return { suppliers, isLoading, error, refetch };
}

export default useGetSuppliers;
