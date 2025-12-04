"use server";

import { filterTasks } from "./fillterTasks";
import { getTask } from "./gettask";
import { getTaskPublic } from "./getTaskPublic";
import { TaskFilters, Task } from "@/types/types";

export async function fetchTasks(filters: TaskFilters): Promise<Task[] | null> {
    const result = await filterTasks(filters);
    if (result.error) {
        console.error('Failed to fetch tasks:', result.error);
        return null;
    }
    // Transform Prisma tasks to match Task type (convert supplierId from number to string)
    return result.tasks?.map(task => ({
        ...task,
        supplierId: task.supplierId.toString(),
    })) as Task[] | null;
}

export async function fetchTask(id: string): Promise<Task | null> {
    if (!id) {
        console.error('Task ID is required');
        return null;
    }
    
    const result = await getTask(id);
    if (result.error) {
        // Only log non-404 errors (404 is expected when task is deleted)
        if (result.error !== 'Task not found') {
            console.error('Failed to fetch task:', result.error);
        }
        return null;
    }
    if (!result.task) {
        return null;
    }
    // Transform Prisma task to match Task type (convert supplierId from number to string)
    return {
        ...result.task,
        supplierId: result.task.supplierId.toString(),
    } as Task;
}

// Public fetch task for signature links (no authentication required)
export async function fetchTaskPublic(id: string): Promise<Task | null> {
    if (!id) {
        console.error('Task ID is required');
        return null;
    }
    
    const result = await getTaskPublic(id);
    if (result.error) {
        // Only log non-404 errors (404 is expected when task is deleted)
        if (result.error !== 'Task not found') {
            console.error('Failed to fetch task:', result.error);
        }
        return null;
    }
    if (!result.task) {
        return null;
    }
    // Transform Prisma task to match Task type (convert supplierId from number to string)
    return {
        ...result.task,
        supplierId: result.task.supplierId.toString(),
    } as Task;
}
