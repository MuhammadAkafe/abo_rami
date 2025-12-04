"use server";

import { prisma } from "@/lib/prisma";

// Get single task publicly (for signature links - no authentication required)
export async function getTaskPublic(id: string) {
    try {
        if (!id || typeof id !== 'string') {
            return { error: 'Invalid task ID', task: null };
        }

        const task = await prisma.tasks.findUnique({
            where: { id: id },
            include: { supplier: true },
        });

        if (!task) {
            return { error: 'Task not found', task: null };
        }

        return { error: null, task };
    } catch (error) {
        console.error('Error fetching task:', error);
        return { error: 'Failed to fetch task', task: null };
    }
}