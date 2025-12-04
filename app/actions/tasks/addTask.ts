"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import validateDate from "../validateDate";










// Add task (Admin only)
export async function addTask(taskData: { address: string; description: string; supplierId: string; date: string; city: string 

}) {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', success: false };
        }

        if (session.role !== 'ADMIN') {
            return { error: 'Forbidden: Admin access required', success: false };
        }



        const { isValid, error, date: validatedDate } = validateDate(taskData.date);
        if (!isValid) {
            return { error: error || 'Invalid date', success: false };
        }
        
        if (!taskData.supplierId || typeof taskData.supplierId !== 'string') {
            return { error: 'Invalid supplier ID', success: false };
        }
        
        // Verify that the supplier exists
        const supplier = await prisma.suppliers.findUnique({
            where: { id: taskData.supplierId },
        });
        
        if (!supplier) {
            return { error: 'Supplier not found', success: false };
        }
        
        await prisma.tasks.create({
            data: {
                address: taskData.address,
                description: taskData.description,
                supplierId: taskData.supplierId,
                date: validatedDate!,
                city: taskData.city,
            },
        });
        
        return { error: null, success: true, message: 'Task added successfully' };
    } catch (error) {
        console.error('Error adding task:', error);
        return { error: 'Failed to add task', success: false };
    }
}







