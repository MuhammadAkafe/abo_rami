/* eslint-disable @typescript-eslint/no-explicit-any */
import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
import { Prisma } from "@prisma/client";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    
    // Extract filter parameters
    const status = searchParams.get('status');
    const priority = searchParams.get('priority');
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    
    // Build where clause dynamically
    const whereClause: any = {};
    
    // Add status filter if provided
    if (status && status !== 'all') {
        whereClause.status = status;
    }
    
    // Add priority filter if provided
    if (priority && priority !== 'all') {
        whereClause.priority = priority;
    }
    
    // Add date range filter if provided
    if (startDate || endDate) {
        whereClause.createdAt = {};
        if (startDate) {
            whereClause.createdAt.gte = new Date(startDate);
        }
        if (endDate) {
            whereClause.createdAt.lte = new Date(endDate);
        }
    } else {
        // Default: show all tasks from beginning of time to current date
        whereClause.createdAt = {
            lte: new Date()
        };
    }
    
    const tasks = await prisma.tasks.findMany({
        where: whereClause,
        orderBy: {
            createdAt: 'desc' // Sort from newest to oldest
        }
    });
    
    if (!tasks) {
        return NextResponse.json({ error: "Tasks not found" }, { status: 404 });
    }
    return NextResponse.json(tasks);
}
