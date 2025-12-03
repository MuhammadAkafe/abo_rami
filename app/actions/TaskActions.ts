"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import { Prisma } from "@prisma/client";
import { TaskFilters } from "@/types/types";

type status = 'PENDING' | 'COMPLETED' | 'REJECTED';


        // Date validation
        function validateDate(dateString: string): { isValid: boolean; date?: Date; error?: string } {
            if (!dateString) {
                return { isValid: false, error: "Date is required" };
            }

            const date = new Date(dateString);
            
            if (isNaN(date.getTime())) {
                return { isValid: false, error: "Invalid date format" };
            }

            const today = new Date();
            today.setHours(0, 0, 0, 0);
            
            if (date < today) {
                return { isValid: false, error: "Date cannot be in the past" };
            }

            const maxDate = new Date();
            maxDate.setFullYear(maxDate.getFullYear() + 1);
            
            if (date > maxDate) {
                return { isValid: false, error: "Date cannot be more than 1 year in the future" };
            }

            return { isValid: true, date };
        }

// Filter tasks with permission checks
export async function filterTasks(filters: TaskFilters) {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', tasks: [] };
        }

        const whereClause: Prisma.tasksWhereInput = {};

        // Admin sees only tasks from suppliers they created (filtered by supplier.userId)
        // Regular users (suppliers) only see their own tasks
        if (session.role === 'ADMIN') {
            whereClause.supplier = {
                userId: session.id
            };
        } else {
            whereClause.supplierId = session.id;
        }

        // Filter by status if provided and not 'ALL'
        if (filters.status && filters.status !== 'ALL') {
            whereClause.status = filters.status as status;
        }

        // Filter by date range if provided
        const hasStartDate = filters.startDate && filters.startDate.toString().trim() !== '';
        const hasEndDate = filters.endDate && filters.endDate.toString().trim() !== '';
        
        if (hasStartDate && hasEndDate) {
            // Both dates provided - use the date range
            whereClause.date = {};
            const start = new Date(filters.startDate + 'T00:00:00');
            whereClause.date.gte = start;
            
            const end = new Date(filters.endDate + 'T23:59:59.999');
            whereClause.date.lte = end;
        } else if (hasStartDate && !hasEndDate) {
            // Only startDate provided - default to that day (start to end of day)
            const selectedDate = new Date(filters.startDate + 'T00:00:00');
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
            
            whereClause.date = {
                gte: startOfDay,
                lt: endOfDay,
            };
        } else if (!hasStartDate && hasEndDate) {
            // Only endDate provided - filter up to end of that day
            const end = new Date(filters.endDate + 'T23:59:59.999');
            whereClause.date = {
                lte: end,
            };
        } else {
            // No date filters provided - default to today
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            const endOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate() + 1);
            
            whereClause.date = {
                gte: startOfDay,
                lt: endOfDay,
            };
        }

        const tasks = await prisma.tasks.findMany({
            where: whereClause,
            include: {
                supplier: true,
            },
            orderBy: {
                date: 'desc',
            },
        });
        
        return { error: null, tasks };
    } catch (error) {
        console.error('Error fetching filtered tasks:', error);
        return { error: 'Failed to fetch tasks', tasks: [] };
    }
}

// Get single task
export async function getTask(id: string) {
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

        return { error: null, task };
    } catch (error) {
        console.error('Error fetching task:', error);
        return { error: 'Failed to fetch task', task: null };
    }
}

// Add task (Admin only)
export async function addTask(taskData: { address: string; description: string; supplierId: string; date: string; city: string }) {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', success: false };
        }

        if (session.role !== 'ADMIN') {
            return { error: 'Forbidden: Admin access required', success: false };
        }



        const { isValid, error, date: validatedDate } = validateDate(taskData.date);
        if (!isValid) {
            return { error: error || 'Invalid date', success: false };
        }
        
        if (!taskData.supplierId || typeof taskData.supplierId !== 'string') {
            return { error: 'Invalid supplier ID', success: false };
        }
        
        // Verify that the supplier exists
        const supplier = await prisma.suppliers.findUnique({
            where: { id: taskData.supplierId },
        });
        
        if (!supplier) {
            return { error: 'Supplier not found', success: false };
        }
        
        await prisma.tasks.create({
            data: {
                address: taskData.address,
                description: taskData.description,
                supplierId: taskData.supplierId,
                date: validatedDate!,
                city: taskData.city,
            },
        });
        
        return { error: null, success: true, message: 'Task added successfully' };
    } catch (error) {
        console.error('Error adding task:', error);
        return { error: 'Failed to add task', success: false };
    }
}

// Delete task (Admin only)
export async function deleteTask(id: string) {
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

// Update task (User only - for status and signature)
export async function updateTask(id: string, updateData: { status?: 'PENDING' | 'COMPLETED' | 'REJECTED'; url?: string }) {
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

        return { error: null, task: updatedTask };
    } catch (error) {
        console.error('Error updating task:', error);
        return { error: 'Failed to update task', task: null };
    }
}

