import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {   
try{
    const { searchParams } = new URL(request.url);
    const supplier_id = searchParams.get('supplier_id');
    if(!supplier_id){
        return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
    }
    const cities = await prisma.cities.findMany({
        where: {
            supplierid: parseInt(supplier_id)
        },
        select: {
            id: true,
            city: true
        }
    });
    return NextResponse.json(cities);
}
catch(error){
    console.error("Error getting cities:", error);
    return NextResponse.json({ error: "Failed to get cities" }, { status: 500 });
}
}