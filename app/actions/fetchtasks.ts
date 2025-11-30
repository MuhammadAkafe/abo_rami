"use server";

import { filterTasks, getTask } from "./TaskActions";
import { TaskFilters } from "@/types/types";

export async function fetchTasks(filters: TaskFilters) {
    const result = await filterTasks(filters);
    if (result.error) {
        console.error('Failed to fetch tasks:', result.error);
        return [];
    }
    return result.tasks;
}

export async function fetchTask(id: string) {
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
    return result.task;
}
