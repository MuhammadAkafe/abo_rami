import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import { cookies } from 'next/headers';
import { redisClient } from '@/lib/redis';
import { SessionData } from '@/lib/session';

export async function POST(request: NextRequest) {
  try {
    // Get session from cookies (middleware already handles authentication and role check)
    const cookieStore = await cookies();
    const sessionId = cookieStore.get('session_id')?.value;
    
    if (!sessionId) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
    }
    
    const redisData = await redisClient.get(`session:${sessionId}`);
    const session = redisData as unknown as SessionData;
    
    if (!session) {
      return NextResponse.json({ message: 'Unauthorized' }, { status: 401 });
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

    // Verify the user exists in the database
    const user = await prisma.users.findUnique({
      where: { id: session.id },
    });

    if (!user) {
      return NextResponse.json({ message: 'User not found' }, { status: 404 });
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