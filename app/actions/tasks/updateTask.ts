"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Task } from "@/types/types";
import { Prisma } from "@prisma/client";
interface updateTaskResult {
    error?: string | null;
    task?: Task | null;
}

interface updateTaskData {
    status?: 'PENDING' | 'COMPLETED' | 'REJECTED';
    url?: string;
}
// Update task (User only - for status and signature)
export async function updateTask(id: string, updateData: updateTaskData): Promise<updateTaskResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', task: null };
        }

        if (session.role !== 'USER') {
            return { error: 'Forbidden: User access required', task: null };
        }

        if (!id || typeof id !== 'string') {
            return { error: 'Invalid task ID', task: null };
        }

        // Check if task exists and belongs to the user
        const existingTask = await prisma.tasks.findUnique({
            where: { id: id },
        });

        if (!existingTask) {
            return { error: 'Task not found', task: null };
        }

        // Users can only update their own tasks
        if (existingTask.supplierId !== session.id) {
            return { error: 'Forbidden: You can only update your own tasks', task: null };
        }

        // Update the task
        const updateFields: Prisma.tasksUpdateInput = {};
        if (updateData.status) updateFields.status = updateData.status;
        if (updateData.url) updateFields.url = updateData.url;

        const updatedTask = await prisma.tasks.update({
            where: { id: id },
            data: updateFields,
            include: {
                supplier: true,
            },
        });

        return { error: null, task: updatedTask as Task };
    } catch (error) {
        console.error('Error updating task:', error);
        return { error: 'Failed to update task', task: null };
    }
}
