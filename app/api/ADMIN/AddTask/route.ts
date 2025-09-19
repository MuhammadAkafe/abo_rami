import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";


export async function POST(request: Request) {
    try{
    const { searchParams } = new URL(request.url);
    const { description, address, city, date } = await request.json();
    const userid = searchParams.get('userid');
    const supplierid = searchParams.get('supplierid');
    
    if(!userid || !supplierid){
        return NextResponse.json({ error: "User ID and Supplier ID are required" }, { status: 400 });
    }
    
    const task = await prisma.tasks.create({
        data: { 
            description, 
            address, 
            city, 
            date: new Date(date), 
            userid: parseInt(userid as string),
            supplierid: parseInt(supplierid as string),
            status: 'PENDING' // Set default status
        }
    });
    
    return NextResponse.json(task);
    } 
    catch (error) 
    {
        console.error(error);
        return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
    }
}
