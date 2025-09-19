import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
import { Status } from "@prisma/client";

export async function PUT(request: Request) {
    try {
        const body = await request.json();
        const { taskId, status, supplierId, imageUrl } = body;

        // Validate required fields
        if (!taskId || !supplierId) {
            return NextResponse.json(
                { error: "Task ID and supplier ID are required" },
                { status: 400 }
            );
        }

        // Validate that at least one field is being updated
        if (!status && !imageUrl) {
            return NextResponse.json(
                { error: "At least one field (status or imageUrl) must be provided for update" },
                { status: 400 }
            );
        }

        // Validate status values if provided
        if (status) {
            const validStatuses: Status[] = ['PENDING', 'COMPLETED', 'REJECTED'];
            if (!validStatuses.includes(status as Status)) {
                return NextResponse.json(
                    { error: "Invalid status. Must be PENDING, COMPLETED, or REJECTED" },
                    { status: 400 }
                );
            }
        }

        // Check if the task exists and belongs to the supplier
        const existingTask = await prisma.tasks.findFirst({
            where: {
                id: parseInt(taskId),
                supplierid: parseInt(supplierId)
            }
        });

        if (!existingTask) {
            return NextResponse.json(
                { error: "Task not found or you don't have permission to edit this task" },
                { status: 404 }
            );
        }

        // Prepare update data
        const updateData: {
            updatedAt: Date;
            status?: Status;
            url?: string;
        } = {
            updatedAt: new Date()
        };

        if (status) {
            updateData.status = status as Status;
        }

        if (imageUrl) {
            updateData.url = imageUrl;
        }

        // Update the task
        const updatedTask = await prisma.tasks.update({
            where: {
                id: parseInt(taskId)
            },
            data: updateData
        });

        return NextResponse.json({
            message: "Task updated successfully",
            task: updatedTask
        }, { status: 200 });

    } catch (error) {
        console.error('Error updating task status:', error);
        return NextResponse.json(
            { error: "Internal server error" },
            { status: 500 }
        );
    }
}
