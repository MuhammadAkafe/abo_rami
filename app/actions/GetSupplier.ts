"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";

export async function GetSupplier(id: string) {
  try {
    const session = await getSession();
    if (!session) {
      return { error: "Unauthorized", supplier: null };
    }

    if (!id || typeof id !== 'string') {
      return { error: "Invalid supplier ID", supplier: null };
    }

    const supplier = await prisma.suppliers.findUnique({
      where: {
        id: id,
      },
      include: {
        cities: true,
        tasks: {
          orderBy: {
            createdAt: 'desc',
          },
        },
        users: {
          select: {
            id: true,
            firstName: true,
            lastName: true,
            email: true,
          },
        },
      },
    });

    if (!supplier) {
      return { error: "Supplier not found", supplier: null };
    }

    return { error: null, supplier };
  } catch (error) {
    console.error('Error getting supplier:', error);
    return { error: "Failed to fetch supplier", supplier: null };
  }
}


