import { NextResponse } from "next/server";
import { prisma } from "@/app/(lib)/prisma";

export async function GET(request: Request) {
    try {
        const users = await prisma.users.findMany();
        if (!users) {
            console.log("No users found");
            return NextResponse.json({ error: "No users found" }, { status: 404 });
        }
        return NextResponse.json(users);
    } 
    catch (error) {
        console.error("Error getting users:", error);
        return NextResponse.json({ error: "Failed to get users" }, { status: 500 });
    }
}