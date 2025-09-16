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
    const user = await prisma.users.findUnique({
        where: { id: task.userid },
    });
    if(!user) {
        return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
    }
    if(user.role !== "ADMIN") {
        return NextResponse.json({ error: "Supplier is not a admin" }, { status: 400 });
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