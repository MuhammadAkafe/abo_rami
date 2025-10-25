"use server";

import { prisma } from "@/lib/prisma";

export const DeleteSupplier = async (id: number) => {
    try {
        await prisma.suppliers.delete({
            where:
            {
                id: id
            }
        });
        return { message: 'Supplier deleted successfully' };
    } 
    catch (error) {
        console.error('Error deleting supplier:', error);
        throw new Error('Error deleting supplier: ' + error);
    }
}