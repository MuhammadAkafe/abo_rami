import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { getSession } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Check authentication
    const session = await getSession();
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }

    // Check if user is ADMIN
    if (session.role !== 'ADMIN') {
      return NextResponse.json({ message: 'Forbidden: Admin access required' }, { status: 403 });
    }

    const { firstName, lastName, email, phone, password, cities } = await request.json();

    // Validate required fields
    if (!firstName || !lastName || !email || !password) {
      return NextResponse.json(
        { message: 'Missing required fields: firstName, lastName, email, and password are required' },
        { status: 400 }
      );
    }

    // Check if supplier already exists by email
    const existingSupplierByEmail = await prisma.suppliers.findUnique({
      where: {
        email: email,
      },
    });

    if (existingSupplierByEmail) {
      return NextResponse.json({ message: 'Supplier with this email already exists' }, { status: 400 });
    }

    // Create supplier
    const supplier = await prisma.suppliers.create({
      data: {
        users: {
          connect: { id: session.id },
        },
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

    return NextResponse.json(
      { message: 'Supplier created successfully', supplier },
      { status: 201 }
    );
  } catch (error) {
    console.error('Error creating supplier:', error);
    return NextResponse.json(
      { message: 'Internal server error' },
      { status: 500 }
    );
  }
}