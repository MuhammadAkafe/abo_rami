import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";

export async function DELETE(request: Request) {
    try {
        const { id } = await request.json();
        
        if (!id) {
            return NextResponse.json({ error: "Task ID is required" }, { status: 400 });
        }

        await prisma.tasks.delete({
            where: {
                id: parseInt(id)
            }
        });
        
        return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } 
    catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Failed to delete task" }, { status: 500 });
    }
}
