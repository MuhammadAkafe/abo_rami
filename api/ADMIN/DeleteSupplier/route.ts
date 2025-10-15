import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";

export async function DELETE(request: Request) {
    try {
    const { searchParams } = new URL(request.url);
    const supplierid = searchParams.get('supplierid');
    if (!supplierid) {
        return NextResponse.json({ error: "Supplier ID is required" }, { status: 400 });
    }

    await prisma.suppliers.delete({
        where: {
            id: parseInt(supplierid)
        }
        });
        return NextResponse.json({ message: "Supplier deleted successfully" }, { status: 200 });
    } 
    catch (error) {
        console.error(error);
        return NextResponse.json({ error: "Failed to delete supplier" }, { status: 500 });
    }
}
