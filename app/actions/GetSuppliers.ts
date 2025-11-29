"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const GetSuppliers = async () => {
    try {
        const session = await getSession();
        if (!session) {
            return []
        }
        if (session.role !== 'ADMIN') {
            return { message: 'Forbi[dden: Admin access required', suppliers:null };
        }
        const suppliers = await prisma.suppliers.findMany({
            include: {
                cities: true
            }
        });
        return suppliers;
    } catch (error) {
        console.error('Error getting suppliers:', error);
        return [];
    }
}

export default GetSuppliers;