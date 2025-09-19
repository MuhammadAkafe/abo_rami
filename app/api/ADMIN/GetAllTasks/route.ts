import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid');
    
    // Get start of today
    const today = new Date();
    const startOfDay = new Date(today.getFullYear(), today.getMonth(), today.getDate());
    
    const tasks = await prisma.tasks.findMany({
        where: { 
            userid: parseInt(userid as string),
            date: {
                gte: startOfDay
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
        }
    });
    return NextResponse.json(tasks);
}
