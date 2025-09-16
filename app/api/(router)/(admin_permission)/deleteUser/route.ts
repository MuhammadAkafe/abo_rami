import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try {
        const { searchParams } = new URL(req.url);
        const user_id = searchParams.get('id') ;
        if (!user_id) {
            return NextResponse.json({ error: "User ID is required" }, { status: 400 });
        }
        // Delete the user
        await prisma.users.delete({
            where: { id: parseInt(user_id) },
        });
        
        return NextResponse.json({ message: "User deleted successfully" }, { status: 200 });
    }
    catch (error) {
        console.error("Error deleting user:", error);
        return NextResponse.json({ error: "Failed to delete user" }, { status: 500 });
    }
}