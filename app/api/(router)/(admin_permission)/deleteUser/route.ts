import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { id } = await req.json();
        
        if (!id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }

        // Check if the user exists
        const user = await prisma.users.findUnique({
            where: { id: parseInt(id) },
        });
        
        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        // Delete the user
        await prisma.users.delete({
            where: { id: parseInt(id) },
        });
        
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}