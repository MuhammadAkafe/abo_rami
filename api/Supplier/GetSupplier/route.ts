import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export async function GET(request: Request) {
    const { searchParams } = new URL(request.url);
    const supplierId = searchParams.get('supplierId');
    
    try {
        if (!supplierId) {
            return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
        }

        const supplier = await prisma.suppliers.findUnique({
            where: {
                id: parseInt(supplierId)
            },
            include: {
                user: {
                    select: {
                        firstName: true,
                        lastName: true,
                        email: true
                    }
                }
            }
        });

        if (!supplier) {
            return NextResponse.json(
                { error: "Supplier not found" },
                { status: 404 }
            );
        }

        // Return as array to match the expected format in SupplierTaskDetails component
        return NextResponse.json([supplier], { status: 200 });
    } 
    catch (error) {
        console.error('Error fetching supplier:', error);
        return NextResponse.json(
            { error: "Error fetching supplier" },
            { status: 500 }
        );
    }
}
