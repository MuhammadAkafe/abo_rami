import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/session";

type status = 'PENDING' | 'COMPLETED' | 'REJECTED';

export async function GET(request: Request) {
    try {
        // Get session to determine if this is a user request (filter by supplier) or admin request (all tasks)
        const session = await getSession();
        
        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build the where clause based on filters
        const whereClause: Prisma.tasksWhereInput = {};

        // Admin sees all tasks from all suppliers
        // Regular users (suppliers) only see their own tasks
        if (session && session.role !== 'ADMIN') {
            whereClause.supplierId = session.id;
        }
        // If session is ADMIN or no session, don't filter by supplierId (shows all tasks)

        // Filter by status if provided and not 'ALL'
        if (status && status !== 'ALL') {
            whereClause.status = status as status;
        }

        // Filter by date range if provided
        const hasStartDate = startDate && startDate.trim() !== '';
        const hasEndDate = endDate && endDate.trim() !== '';
        
        if (hasStartDate && hasEndDate) {
            // Both dates provided - use the date range
            whereClause.date = {};
            const start = new Date(startDate + 'T00:00:00');
            whereClause.date.gte = start;
            
            const end = new Date(endDate + 'T23:59:59.999');
            whereClause.date.lte = end;
        } else if (hasStartDate && !hasEndDate) {
            // Only startDate provided - default to that day (start to end of day)
            const selectedDate = new Date(startDate + 'T00:00:00');
            const startOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate());
            const endOfDay = new Date(selectedDate.getFullYear(), selectedDate.getMonth(), selectedDate.getDate() + 1);
            
            whereClause.date = {
                gte: startOfDay,
                lt: endOfDay,
            };
        } else if (!hasStartDate && hasEndDate) {
            // Only endDate provided - filter up to end of that day
            const end = new Date(endDate + 'T23:59:59.999');
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
        return NextResponse.json(tasks);
    } 
    catch (error) 
    {
        console.error('Error fetching filtered tasks:', error);
        return NextResponse.json(
            { error: 'Failed to fetch tasks' },
            { status: 500 }
        );
    }
}