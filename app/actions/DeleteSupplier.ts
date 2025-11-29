"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const DeleteSupplier = async (id: number) => {
    try {
        const session = await getSession();
        if (!session) {
            return { message: 'Unauthorized' };
        }
        if (session.role !== 'ADMIN') {
            return { message: 'Forbidden: Admin access required' };
        }
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