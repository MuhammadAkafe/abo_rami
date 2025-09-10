import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
export async function GET(req: Request, { params }: { params: { userId: string } }) 
{   
    try{
    const tasks = await prisma.tasks.findMany(
        {
        where: {
            userId: parseInt(params.userId),
        },
    }
);
    return NextResponse.json(tasks);
    } 
    catch (error) {
        console.error("Error fetching tasks:", error);
        return NextResponse.json({ error: "Error fetching tasks" }, { status: 500 });
    }
}