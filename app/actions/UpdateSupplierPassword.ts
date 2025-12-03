"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from "bcryptjs";

export async function UpdateSupplierPassword(
  supplierId: string,
  newPassword: string
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Only ADMIN can change supplier passwords
    if (session.role !== 'ADMIN') {
      return { success: false, error: "Forbidden: Admin access required" };
    }

    // Validate password
    if (!newPassword || newPassword.length < 8) {
      return { success: false, error: "Password must be at least 8 characters" };
    }

    if (newPassword.length > 100) {
      return { success: false, error: "Password is too long (max 100 characters)" };
    }

    if (!supplierId || typeof supplierId !== 'string') {
      return { success: false, error: "Invalid supplier ID" };
    }

    // Check if supplier exists
    const supplier = await prisma.suppliers.findUnique({
      where: { id: supplierId },
    });

    if (!supplier) {
      return { success: false, error: "Supplier not found" };
    }

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the password
    await prisma.suppliers.update({
      where: { id: supplierId },
      data: { password: hashedPassword },
    });

    return { success: true };
  } catch (error) {
    console.error('Error updating supplier password:', error);
    return { success: false, error: "Failed to update password" };
  }
}


