import { useQuery } from "@tanstack/react-query";
import { DeleteSupplier } from "@/app/actions/DeleteSupplier";
import { useMutation } from "@tanstack/react-query";

export const useDeleteSupplier = () => {
    const mutation = useMutation({
        mutationFn: async (id: string) => await DeleteSupplier(id),
        onSuccess: () => {
            console.log('Supplier deleted successfully');
        },
        onError: (error) => {
            console.error('Error deleting supplier:', error);
        },
    });
    return { mutation, isPending: mutation.isPending, error: mutation.error, isSuccess: mutation.isSuccess };
}

export default useDeleteSupplier;