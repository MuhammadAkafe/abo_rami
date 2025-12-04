"use server";

import { prisma } from "@/lib/prisma";
import { getSession } from "@/lib/session";
import bcrypt from 'bcryptjs';
import { NewSupplier } from "@/types/types";

// Add supplier (Admin only)
export async function addSupplier(formData: NewSupplier) {
    try {
        const session = await getSession();
        if (!session) {
            return { error: 'Unauthorized', supplier: null };
        }

        if (session.role !== 'ADMIN') {
            return { error: 'Forbidden: Admin access required', supplier: null };
        }

        const { firstName, lastName, email, phone, password, cities } = formData;

        // Validate required fields
        if (!firstName || !lastName || !email || !password) {
            return {
                error: 'Missing required fields: firstName, lastName, email, and password are required',
                supplier: null
            };
        }

        // Check if supplier already exists by email
        const existingSupplierByEmail = await prisma.suppliers.findUnique({
            where: { email: email },
        });

        if (existingSupplierByEmail) {
            return { error: 'Supplier with this email already exists', supplier: null };
        }

        // Verify the user exists in the database
        const user = await prisma.users.findUnique({
            where: { id: session.id },
        });

        if (!user) {
            return { error: 'User not found', supplier: null };
        }

        // Create supplier
        const supplier = await prisma.suppliers.create({
            data: {
                userId: session.id,
                firstName,
                lastName,
                email,
                phone: phone || null,
                password: await bcrypt.hash(password, 10),
            },
        });

        // Create cities for the supplier if provided
        if (cities && Array.isArray(cities) && cities.length > 0) {
            await prisma.cities.createMany({
                data: cities.map((city: string) => ({
                    city: city,
                    supplierId: supplier.id,
                })),
            });
        }

        return { error: null, supplier, message: 'Supplier created successfully' };
    } catch (error) {
        console.error('Error creating supplier:', error);
        return { error: 'Internal server error', supplier: null };
    }
}

