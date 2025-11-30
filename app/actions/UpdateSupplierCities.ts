"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function UpdateSupplierCities(
  supplierId: string,
  cities: string[]
): Promise<{ success: boolean; error?: string }> {
  try {
    const session = await getSession();
    if (!session) {
      return { success: false, error: "Unauthorized" };
    }

    // Only ADMIN can update supplier cities
    if (session.role !== 'ADMIN') {
      return { success: false, error: "Forbidden: Admin access required" };
    }

    // Validate cities array
    if (!Array.isArray(cities)) {
      return { success: false, error: "Cities must be an array" };
    }

    // Validate each city
    const validCities = cities
      .filter((city): city is string => typeof city === 'string' && city.trim().length > 0)
      .map(city => city.trim());

    if (validCities.length > 20) {
      return { success: false, error: "Too many cities (max 20)" };
    }

    const id = parseInt(supplierId);
    if (isNaN(id)) {
      return { success: false, error: "Invalid supplier ID" };
    }

    // Check if supplier exists
    const supplier = await prisma.suppliers.findUnique({
      where: { id },
    });

    if (!supplier) {
      return { success: false, error: "Supplier not found" };
    }

    // Delete all existing cities for this supplier
    await prisma.cities.deleteMany({
      where: { supplierId: id },
    });

    // Create new cities if any
    if (validCities.length > 0) {
      await prisma.cities.createMany({
        data: validCities.map((city) => ({
          city: city,
          supplierId: id,
        })),
      });
    }

    return { success: true };
  } catch (error) {
    console.error('Error updating supplier cities:', error);
    return { success: false, error: "Failed to update cities" };
  }
}


