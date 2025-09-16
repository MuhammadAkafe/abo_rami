import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function GET(req: Request) {
    try {
        const tasks = await prisma.tasks.findMany({
            include: {
                user: {
                    select: {
                        id: true,
                        firstName: true,
                        lastName: true,
                        email: true,
                        phone: true
                    }
                }
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        return NextResponse.json({ tasks }, { status: 200 });
    } catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ 
            error: "Failed to fetch tasks", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}
