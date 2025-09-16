import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function POST(req: Request) 
{
    try{
    const { address, description,date, taskArea, userid } = await req.json();


    await prisma.tasks.create({
        data: {
            address,
            description,
            date,
            taskArea,
            userid: parseInt(userid)
        }
    });
    return NextResponse.json({ message: "Task created successfully" }, { status: 200 });
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