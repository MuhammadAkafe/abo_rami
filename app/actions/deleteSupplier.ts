"use server";

import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';






export const DeleteSuppliers = async (clerkId: string): Promise<void> => {
    try {
        const client = await clerkClient();
        await client.users.deleteUser(clerkId);
        await prisma.users.delete({
            where: {
                clerkid: clerkId
            }
        });
    } 
    catch (error) {
        throw new Error('Error deleting supplier: ' + error);
    }
};
