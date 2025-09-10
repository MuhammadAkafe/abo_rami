import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) 
{
    try{
    const { address, description, priority, status, userId } = await req.json();
    const user = await prisma.users.findUnique({
        where: { id: userId },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    const task = await prisma.tasks.create({
        data: { address, description, priority, status, userId },
    });
    return NextResponse.json({ message: "Task created successfully" }, { status: 200 });
    } 
    catch (error) 
    {
        console.error("Error creating task:", error);
        return NextResponse.json({ error: "Task not created" }, { status: 500 });
    }
}