"use server";


import { prisma } from '@/lib/prisma';
import { supplierList } from '@/types/types';



export const getSuppliers = async (clerkId: string): Promise<supplierList[] | null> => {
    try {
        const suppliers = await prisma.users.findMany({
            where: {
                clerkid: {
                    not: clerkId
                },
            },
            include: {
                cities: true,
            }
        });
        
        // Map clerkid to clerkId to match the supplierList type
        const mappedSuppliers: supplierList[] = suppliers.map(supplier => ({
            ...supplier,
            clerkId: supplier.clerkid
        }));
        
        return mappedSuppliers;
    } catch (error) {
        console.error('Error fetching suppliers:', error);
        return null;
    }
};