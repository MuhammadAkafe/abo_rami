import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

 export async function DELETE(req: Request) {
    const { id } = await req.json();
    const user = await prisma.suppliers.findUnique({
        where: { id },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
    try{
    await prisma.suppliers.delete({
        where: { id },
    });
    return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
}
    catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "User not deleted" }, { status: 500 });
    }
 }