import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    try {
        const { searchParams } = new URL(request.url);
        const supplierId = searchParams.get('supplierId');
        
        if (!supplierId) {
            return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
        }

        const supplierIdNum = parseInt(supplierId);
        if (isNaN(supplierIdNum)) {
            return NextResponse.json({ error: "Invalid Supplier ID format" }, { status: 400 });
        }

        // Check if supplier exists
        const supplier = await prisma.suppliers.findUnique({ 
            where: { id: supplierIdNum } 
        });
        
        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }

        // Calculate date range: last week to today
        const today = new Date();
        const lastWeek = new Date();
        lastWeek.setDate(today.getDate() - 7);
        
        // Set time to start of day for last week and end of day for today
        lastWeek.setHours(0, 0, 0, 0);
        today.setHours(23, 59, 59, 999);

        // Get tasks assigned to this supplier within the date range
        const tasks = await prisma.tasks.findMany({
            where: {
                supplierid: supplierIdNum,
                date: {
                    gte: lastWeek,
                    lte: today
                }
            },
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
                date: 'desc'
            }
        });

        return NextResponse.json(tasks);
    } catch (error) {
        console.error("GetSupplierTasks error:", error);
        return NextResponse.json({ error: "Failed to fetch supplier tasks" }, { status: 500 });
    }
}
