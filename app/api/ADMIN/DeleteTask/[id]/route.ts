import { NextResponse } from "next/server";
import { getSession } from "@/lib/session";
import { prisma } from "@/lib/prisma";

export async function DELETE(
    request: Request,
    { params }: { params: Promise<{ id: string }> }
  ) {
    try {
  
      const session = await getSession();
      if (!session) {
        return NextResponse.json(
          { error: 'Unauthorized' },
          { status: 401 }
        );
      }
  
      if (session.role !== 'ADMIN') {
        return NextResponse.json(
          { error: 'Forbidden: Admin access required' },
          { status: 403 }
        );
      }
  
      const resolvedParams = await params;
      const taskId = parseInt(resolvedParams.id);
  
  
      
      if (isNaN(taskId)) {
        return NextResponse.json(
          { error: 'Invalid task ID' },
          { status: 400 }
        );
      }
  
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
  
      // Delete the task
      await prisma.tasks.delete({
        where: { id: taskId },
      });
  
      return NextResponse.json({ message: 'Task deleted successfully' });
    } catch (error) {
      console.error('Error deleting task:', error);
      return NextResponse.json(
        { error: 'Failed to delete task' },
        { status: 500 }
      );
    }
  }