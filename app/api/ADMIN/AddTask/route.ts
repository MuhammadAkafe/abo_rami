import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
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

      const session = await getSession();
      if (!session) {
        return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
      }
  
      // Check if user is ADMIN
      if (session.role !== 'ADMIN') {
        return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
      }

      const taskData = await request.json();
      const { address, description, supplierId, date, city } = taskData;
      const { isValid, error, date: validatedDate } = validateDate(date);
      if (!isValid) {
        return NextResponse.json({ success: false, message: error }, { status: 400 });
      }
      
      // Convert supplierId to number
      const supplierIdNumber = parseInt(supplierId);
      if (isNaN(supplierIdNumber)) {
        return NextResponse.json({ success: false, message: "Invalid supplier ID" }, { status: 400 });
      }
      
      // Verify that the supplier exists
      const supplier = await prisma.suppliers.findUnique({
        where: { id: supplierIdNumber },
      });
      if (!supplier) {
        return NextResponse.json({ success: false, message: "Supplier not found" }, { status: 400 });
      }
      
      await prisma.tasks.create({
        data: { address, description, supplierId: supplierIdNumber, date: validatedDate, city },
      });
      return NextResponse.json({ success: true, message: "Task added successfully" }, { status: 200 });
    } 
    catch (error) 
    {
      console.error("Error adding task: " + error);
      return NextResponse.json({ success: false, message: "Error adding task" }, { status: 500 });
    }
}
