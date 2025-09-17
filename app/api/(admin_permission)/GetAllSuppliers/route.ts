import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid');
    try {
        const suppliers = await prisma.suppliers.findMany({
            where: {
                userid: userid ? parseInt(userid) : undefined
            }
        });
        if (!suppliers) 
            {
            return NextResponse.json(
                { error: "No suppliers found" },
                { status: 404 }
            );
        }
        return NextResponse.json(suppliers, { status: 200 });
    } 
    catch (error) 
    {
        console.error('Error fetching suppliers:', error);
        return NextResponse.json(
            { error: "Error fetching suppliers" },
            { status: 500 }
        );
    }
    
}