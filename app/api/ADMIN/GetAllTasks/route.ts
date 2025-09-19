import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";

// Date validation helper function for filter dates
function validateFilterDate(dateString: string): { isValid: boolean; date?: Date; error?: string } {
    if (!dateString) {
        return { isValid: true }; // Empty date is valid (optional filter)
    }

    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return { isValid: false, error: "Invalid date format" };
    }

    // Check if date is not too far in the past (e.g., not more than 5 years ago)
    const minDate = new Date();
    minDate.setFullYear(minDate.getFullYear() - 5);
    
    if (date < minDate) {
        return { isValid: false, error: "Date cannot be more than 5 years in the past" };
    }

    // Check if date is not too far in the future (e.g., not more than 1 year)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    if (date > maxDate) {
        return { isValid: false, error: "Date cannot be more than 1 year in the future" };
    }

    return { isValid: true, date };
}

// Validate date range logic
function validateDateRange(startDate?: Date, endDate?: Date): { isValid: boolean; error?: string } {
    if (startDate && endDate && startDate > endDate) {
        return { isValid: false, error: "Start date cannot be after end date" };
    }
    return { isValid: true };
}

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const userid = searchParams.get('userid');
        const status = searchParams.get('status');
        const startDate = searchParams.get('startDate');
        const endDate = searchParams.get('endDate');
        
        // Validate required userid
        if (!userid) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        const userIdNum = parseInt(userid as string);
        if (isNaN(userIdNum)) {
            return NextResponse.json({ error: "Invalid User ID format" }, { status: 400 });
        }

        // Check if user exists
        const user = await prisma.users.findUnique({ where: { id: userIdNum } });
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Validate start date
        const startDateValidation = validateFilterDate(startDate || '');
        if (!startDateValidation.isValid) {
            return NextResponse.json({ error: `Start date: ${startDateValidation.error}` }, { status: 400 });
        }

        // Validate end date
        const endDateValidation = validateFilterDate(endDate || '');
        if (!endDateValidation.isValid) {
            return NextResponse.json({ error: `End date: ${endDateValidation.error}` }, { status: 400 });
        }

        // Validate date range
        const rangeValidation = validateDateRange(startDateValidation.date, endDateValidation.date);
        if (!rangeValidation.isValid) {
            return NextResponse.json({ error: rangeValidation.error }, { status: 400 });
        }

        // Validate status
        if (status && status !== 'all' && status !== '' && !Object.values(Status).includes(status as Status)) {
            return NextResponse.json({ error: "Invalid status value" }, { status: 400 });
        }
        
        // Build where clause
        const whereClause: {
            userid: number;
            date?: {
                gte?: Date;
                lte?: Date;
            };
            status?: Status;
        } = {
            userid: userIdNum
        };

        // Add date filter - default to today if no dates provided
        if (startDateValidation.date || endDateValidation.date) {
            whereClause.date = {};
            if (startDateValidation.date) {
                whereClause.date.gte = startDateValidation.date;
            }
            if (endDateValidation.date) {
                // Set end date to end of day for inclusive filtering
                const endOfDay = new Date(endDateValidation.date);
                endOfDay.setHours(23, 59, 59, 999);
                whereClause.date.lte = endOfDay;
            }
        } else {
            // Default to today's tasks if no date filter is provided
            const today = new Date();
            const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
            whereClause.date = {
                gte: startOfDay
            };
        }

        // Add status filter
        if (status && status !== 'all' && status !== '') {
            whereClause.status = status as Status;
        }
        
        const tasks = await prisma.tasks.findMany({
            where: whereClause,
            include: {
                supplier: {
                    select: {
                        firstName: true,
                        lastName: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                date: 'asc' // Order by date ascending
            }
        });
        
        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GetAllTasks error:", error);
        return NextResponse.json({ error: "Failed to fetch tasks" }, { status: 500 });
    }
}
