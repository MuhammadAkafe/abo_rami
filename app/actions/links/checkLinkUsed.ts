"use server";

import { prisma } from "@/lib/prisma";

interface checkLinkUsedResult {
    error?: string | null;
    isUsed?: boolean;
}

// Check if link is used for a task
export async function checkLinkUsed(taskId: string): Promise<checkLinkUsedResult> {
    try {
        if (!taskId || typeof taskId !== 'string') {
            return { error: 'Invalid task ID', isUsed: false };
        }

        // Get task to check if signature exists
        const task = await prisma.tasks.findUnique({
            where: { id: taskId },
            select: { url: true },
        });

        if (!task) {
            return { error: 'Task not found', isUsed: false };
        }

        const link = await prisma.link.findUnique({
            where: { taskId: taskId },
        });

        // If no link exists, it's not used
        if (!link) {
            return { error: null, isUsed: false };
        }

        // If link is marked as used but task has no signature, reset it (error recovery)
        if (link.isUsed && !task.url) {
            await prisma.link.update({
                where: { taskId: taskId },
                data: { isUsed: false },
            });
            return { error: null, isUsed: false };
        }

        return { error: null, isUsed: link.isUsed };
    } catch (error) {
        console.error('Error checking link:', error);
        return { error: 'Failed to check link', isUsed: false };
    }
}