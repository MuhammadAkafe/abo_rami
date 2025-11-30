import { NextResponse } from "next/server";
import { prisma } from "@/lib/prisma";
import { Prisma } from "@prisma/client";

export async function PUT(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
      const resolvedParams = await params;
      const taskId = parseInt(resolvedParams.id);

      if (isNaN(taskId)) {
        return NextResponse.json(
          { error: 'Invalid task ID' },
          { status: 400 }
        );
      }
  
      const body = await request.json();
      const { status, url } = body;
  
      // Check if task exists
      const existingTask = await prisma.tasks.findUnique({
        where: { id: taskId },
      });
  
      if (!existingTask) {
        return NextResponse.json(
          { error: 'Task not found' },
          { status: 404 }
        );
      }
  
      // Update the task
      const updateData: Prisma.tasksUpdateInput = {};
      if (status) updateData.status = status as 'PENDING' | 'COMPLETED' | 'REJECTED';
      if (url) updateData.url = url;
  
      const updatedTask = await prisma.tasks.update({
        where: { id: taskId },
        data: updateData,
        include: {
          supplier: true,
        },
      });
  
      return NextResponse.json(updatedTask);
    } catch (error) {
      console.error('Error updating task:', error);
      return NextResponse.json(
        { error: 'Failed to update task' },
        { status: 500 }
      );
    }
  }