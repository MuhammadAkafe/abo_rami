"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
interface deleteTaskResult {
    error?: string | null;
    success?: boolean ;
    message?: string | null;
}
// Delete task (Admin only)
export async function deleteTask(id: string): Promise<deleteTaskResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', success: false };
        }

        if (session.role !== 'ADMIN') {
            return { error: 'Forbidden: Admin access required', success: false };
        }

        if (!id || typeof id !== 'string') {
            return { error: 'Invalid task ID', success: false };
        }

        // Check if task exists
        const existingTask = await prisma.tasks.findUnique({
            where: { id: id },
        });

        if (!existingTask) {
            return { error: 'Task not found', success: false };
        }

        // Delete the task
        await prisma.tasks.delete({
            where: { id: id },
        });

        return { error: null, success: true, message: 'Task deleted successfully' };
    } catch (error) {
        console.error('Error deleting task:', error);
        return { error: 'Failed to delete task', success: false };
    }
}