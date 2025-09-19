import { prisma } from "@/app/(lib)/prisma";
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
        const { searchParams } = new URL(request.url);
        const { description, address, city, date } = await request.json();
        const userid = searchParams.get('userid');
        const supplierid = searchParams.get('supplierid');
        
        // Validate required fields
        if (!userid || !supplierid) {
            return NextResponse.json({ error: "User ID and Supplier ID are required" }, { status: 400 });
        }

        if (!description || !address || !city) {
            return NextResponse.json({ error: "Description, address, and city are required" }, { status: 400 });
        }

        // Validate date
        const dateValidation = validateDate(date);
        if (!dateValidation.isValid) {
            return NextResponse.json({ error: dateValidation.error }, { status: 400 });
        }

        // Validate userid and supplierid are valid numbers
        const userIdNum = parseInt(userid as string);
        const supplierIdNum = parseInt(supplierid as string);
        
        if (isNaN(userIdNum) || isNaN(supplierIdNum)) {
            return NextResponse.json({ error: "Invalid User ID or Supplier ID format" }, { status: 400 });
        }

        // Check if user and supplier exist
        const [user, supplier] = await Promise.all([
            prisma.users.findUnique({ where: { id: userIdNum } }),
            prisma.suppliers.findUnique({ where: { id: supplierIdNum } })
        ]);

        if (!user) {
            return NextResponse.json({ error: "User not found" }, { status: 404 });
        }

        if (!supplier) {
            return NextResponse.json({ error: "Supplier not found" }, { status: 404 });
        }
        
        const task = await prisma.tasks.create({
            data: { 
                description: description.trim(), 
                address: address.trim(), 
                city: city.trim(), 
                date: dateValidation.date, 
                userid: userIdNum,
                supplierid: supplierIdNum,
                status: 'PENDING' // Set default status
            }
        });
        
        return NextResponse.json(task);
    } 
    catch (error) 
    {
        console.error("AddTask error:", error);
        return NextResponse.json({ error: "Failed to add task" }, { status: 500 });
    }
}
