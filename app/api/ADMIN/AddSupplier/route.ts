import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcrypt';
export async function POST(request: NextRequest) {
  try {
    const { firstName, lastName, email, phone, password, cities } = await request.json();



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
        firstName,
        lastName,
        email,
        phone,
        password: await bcrypt.hash(password, 10),
      },
    });

    // Create cities for the supplier
    for (const city of cities) {
      await prisma.cities.create({
        data: {
          city: city,
          supplierId: supplier.id,
        },
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