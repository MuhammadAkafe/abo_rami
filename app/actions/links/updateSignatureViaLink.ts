"use server";

import { prisma } from "@/lib/prisma";
import { Task } from "@/types/types";

interface updateSignatureViaLinkResult {
    error?: string | null;
    task?: Task | null;
}

// Update signature via public link (marks link as used)
export async function updateSignatureViaLink(taskId: string, signatureData: string): Promise<updateSignatureViaLinkResult> {
    try {
        if (!taskId || typeof taskId !== 'string') {
            return { error: 'Invalid task ID', task: null };
        }

        if (!signatureData || typeof signatureData !== 'string') {
            return { error: 'Invalid signature data', task: null };
        }

        // Check if task exists
        const existingTask = await prisma.tasks.findUnique({
            where: { id: taskId },
        });

        if (!existingTask) {
            return { error: 'Task not found', task: null };
        }

        // Check if link is already used
        const link = await prisma.link.findUnique({
            where: { taskId: taskId },
        });

        if (link && link.isUsed) {
            return { error: 'This link has already been used', task: null };
        }

        // Update task signature
        const updatedTask = await prisma.tasks.update({
            where: { id: taskId },
            data: { url: signatureData },
            include: {
                supplier: true,
            },
        });

        // Mark link as used (create if doesn't exist)
        await prisma.link.upsert({
            where: { taskId: taskId },
            update: { isUsed: true },
            create: {
                taskId: taskId,
                isUsed: true,
            },
        });

        return { error: null, task: updatedTask as unknown as Task };
    } catch (error) {
        console.error('Error updating signature via link:', error);
        return { error: 'Failed to update signature', task: null };
    }
}
