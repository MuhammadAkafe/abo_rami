import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";

export async function DELETE(req: Request) {
    try{
    const { id } = await req.json();

    const task = await prisma.tasks.findUnique({
        where: { id },
    });
    if (!task) {
        return NextResponse.json({ error: "Task not found" }, { status: 404 });
    }
    await prisma.tasks.delete({
                where: { id },
            });
    return NextResponse.json({ message: "Task deleted successfully" }, { status: 200 });
    } 
    catch (error) {
        console.error("Error deleting task:", error);
        return NextResponse.json({ error: "Task not deleted" }, { status: 500 });
    }
}