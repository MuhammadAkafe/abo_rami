import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function GET() {
    try {

        // Fetch all users from the database
        const users = await prisma.users.findMany({
            select: {
                id: true,
                firstName: true,
                lastName: true,
                email: true,
                role: true,
                createdAt: true
            },
            orderBy: {
                createdAt: 'desc'
            }
        });

        if (!users || users.length === 0) {
            console.log("No users found");
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }

        return NextResponse.json({
            success: true,
            data: users,
            count: users.length
        });
    } 
    catch (error) {
        console.error("Error getting users:", error);
        return NextResponse.json(
            { error: "Failed to get users" }, 
            { status: 500 }
        );
    }
}
