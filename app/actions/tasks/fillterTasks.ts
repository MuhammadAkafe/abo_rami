"use server";

// Filter tasks with permission checks
import { getSession } from "@/lib/session";
import { Task, TaskFilters } from "@/types/types";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@/prisma/generated/client";

type status = 'PENDING' | 'COMPLETED' | 'REJECTED';
interface filterTasksResult {
    error?: string | null;
    tasks?: Task[] | null;
}
export async function filterTasks(filters: TaskFilters): Promise<filterTasksResult> {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', tasks: null };
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
        
        return { error: null, tasks: tasks as Task[] };
    } catch (error) {
        console.error('Error fetching filtered tasks:', error);
        return { error: 'Failed to fetch tasks', tasks: null };
    }
}