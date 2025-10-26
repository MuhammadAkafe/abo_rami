import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";
import { getSession } from "@/lib/session";

type status = 'PENDING' | 'COMPLETED' | 'REJECTED';

export async function GET(request: Request) {
    try {
        // Get session to get supplier ID
        const session = await getSession();
        
        if (!session) {
            return NextResponse.json(
                { error: 'Unauthorized' },
                { status: 401 }
            );
        }

        const { searchParams } = new URL(request.url);
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');

        // Build the where clause based on filters
        const whereClause: Prisma.tasksWhereInput = {
            supplierId: session.supplierId, // Only get tasks for this specific supplier
        };

        // Filter by status if provided and not 'ALL'
        if (status && status !== 'ALL') {
            whereClause.status = status as status;
        }

        // Filter by date range if provided
        if (startDate || endDate) {
            whereClause.date = {};
            
            if (startDate) {
                const start = new Date(startDate);
                start.setHours(0, 0, 0, 0);
                whereClause.date.gte = start;
            }
            
            if (endDate) {
                const end = new Date(endDate);
                end.setHours(23, 59, 59, 999);
                whereClause.date.lte = end;
            }
        }

        // If no date filters are provided, default to today
        if (!startDate && !endDate) {
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
