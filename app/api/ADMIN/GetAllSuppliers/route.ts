import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const userid = searchParams.get('userid');
    
    try {
        // Validate userid parameter
        if (!userid) {
            console.error('GetAllSuppliers: User ID is missing');
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Validate that userid is a valid number
        const userIdNumber = parseInt(userid);
        if (isNaN(userIdNumber)) {
            console.error('GetAllSuppliers: Invalid user ID format:', userid);
            return NextResponse.json({ error: "Invalid user ID format" }, { status: 400 });
        }

        console.log('GetAllSuppliers: Fetching suppliers for user ID:', userIdNumber);

        // Fetch suppliers from database
        const suppliers = await prisma.suppliers.findMany({
            where: {
                userid: userIdNumber 
            }
        });

        console.log('GetAllSuppliers: Found suppliers count:', suppliers.length);

        // Return suppliers array (empty array is valid - means no suppliers found)
        return NextResponse.json(suppliers, { status: 200 });
    } 
    catch (error) 
    {
        console.error('GetAllSuppliers: Database error:', error);
        
        // More specific error handling
        if (error instanceof Error) {
            console.error('GetAllSuppliers: Error message:', error.message);
            console.error('GetAllSuppliers: Error stack:', error.stack);
        }
        
        return NextResponse.json(
            { 
                error: "Error fetching suppliers",
                details: process.env.NODE_ENV === 'development' ? (error instanceof Error ? error.message : String(error)) : undefined
            },
            { status: 500 }
        );
    }
}