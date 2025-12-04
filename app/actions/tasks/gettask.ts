"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Task } from "@/types/types";

interface getTaskResult {
    error?: string;
    task?: Task | null;
}
// Get single task (requires authentication)
export async function getTask(id: string): Promise<getTaskResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', task: null };
        }

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

        // Users can only see their own tasks, admins can see all
        if (session.role !== 'ADMIN' && task.supplierId !== session.id) {
            return { error: 'Forbidden: You can only view your own tasks', task: null };
        }

        return { error: undefined, task: task as Task };
    } catch (error) {
        console.error('Error fetching task:', error);
        return { error: 'Failed to fetch task' as string, task: null };
    }
}