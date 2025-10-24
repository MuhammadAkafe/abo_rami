import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";
// Date validation helper function
function validateDate(dateString: string): { isValid: boolean; date?: Date; error?: string } {
    if (!dateString) {
        return { isValid: false, error: "Date is required" };
    }

    const date = new Date(dateString);
    
    // Check if date is valid
    if (isNaN(date.getTime())) {
        return { isValid: false, error: "Invalid date format" };
    }

    // Check if date is not in the past (allow today)
    const today = new Date();
    today.setHours(0, 0, 0, 0); // Reset time to start of day
    
    if (date < today) {
        return { isValid: false, error: "Date cannot be in the past" };
    }

    // Check if date is not too far in the future (e.g., not more than 1 year)
    const maxDate = new Date();
    maxDate.setFullYear(maxDate.getFullYear() + 1);
    
    if (date > maxDate) {
        return { isValid: false, error: "Date cannot be more than 1 year in the future" };
    }

    return { isValid: true, date };
}

export async function POST(request: Request) {
    try {
      const taskData = await request.json();
      const { address, description, clerkId, date, city } = taskData;
      const { isValid, error, date: validatedDate } = validateDate(date);
      if (!isValid) {
        return NextResponse.json({ success: false, message: error }, { status: 400 });
      }
      const supplier = await prisma.users.findUnique({
        where: { clerkid: clerkId },
      });
      if (!supplier) {
        return NextResponse.json({ success: false, message: "Supplier not found" }, { status: 400 });
      }
      await prisma.tasks.create({
        data: { address, description, clerkId: clerkId, date: validatedDate, city },
      });
      return NextResponse.json({ success: true, message: "Task added successfully" }, { status: 200 });
    } 
    catch (error) 
    {
      console.error("Error adding task: " + error);
      return NextResponse.json({ success: false, message: "Error adding task" }, { status: 500 });
    }
}
