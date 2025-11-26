"use server";

import { prisma } from "@/lib/prisma";

export const GetSuppliers = async () => {
    try {
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