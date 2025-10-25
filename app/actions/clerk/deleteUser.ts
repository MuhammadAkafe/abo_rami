"use server";

import { prisma } from '@/lib/prisma';
import { clerkClient } from '@clerk/nextjs/server';



export const deleteUserfromClerk = async (clerkId: string): Promise<void> => {
    try {
        const client = await clerkClient();
        await client.users.deleteUser(clerkId);
    }
    catch (error) {
        throw new Error('Error deleting user from Clerk: ' + error);
    }
};

