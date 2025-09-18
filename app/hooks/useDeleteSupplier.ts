import { useMutation } from "@tanstack/react-query";

const deleteSupplier = async (supplierId: number) => {
    const response = await fetch(`/api/ADMIN/DeleteSupplier?supplierid=${supplierId}`, {
        method: 'DELETE',
        headers: {
            'Content-Type': 'application/json',
        },
    });

    if (!response.ok) {
        throw new Error(`Failed to delete supplier: ${response.statusText}`);
    }

    return response.json();
};


export const useDeleteSupplier = () => {
    return useMutation({
        mutationFn: deleteSupplier,
    });
};