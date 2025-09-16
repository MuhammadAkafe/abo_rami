import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) 
{
    try{
    const { address, description, priority, userid } = await req.json();
    
    // Convert userid to integer since it comes as string from form
    const userIdInt = parseInt(userid);
    
    if (isNaN(userIdInt)) {
        return NextResponse.json({ error: "Invalid user ID" }, { status: 400 });
    }

    
    const user = await prisma.users.findUnique({
        where: { id: userIdInt },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    if(user.role !== "ADMIN") {
        return NextResponse.json({ error: "User is not a admin" }, { status: 400 });
    }
    
    const task = await prisma.tasks.create({
        data: { 
            address, 
            description, 
            priority, 
            userid: userIdInt 
        },
    });
    
    return NextResponse.json({ 
        message: "Task created successfully", 
        task: task 
    }, { status: 200 });
    } 
    catch (error) 
    {
        console.error("Error creating task:", error);
        return NextResponse.json({ 
            error: "Task not created", 
            details: error instanceof Error ? error.message : "Unknown error" 
        }, { status: 500 });
    }
}