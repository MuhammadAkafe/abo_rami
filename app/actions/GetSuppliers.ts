"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export const GetSuppliers = async () => {
    try {
        const session = await getSession();
        if (!session) {
            return [];
        }
        
        if (session.role !== 'ADMIN') {
            return [];
        }
        
        // Admin sees only suppliers they created (filtered by userId)
        const suppliers = await prisma.suppliers.findMany({
            where: {
                userId: session.id
            },
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