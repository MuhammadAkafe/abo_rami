import { NextRequest, NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export async function POST(request: NextRequest) {
  try {
    const { email, password } = await request.json();

    // Validate input
    if (!email || !password) {
      return NextResponse.json(
        { success: false, message: 'כתובת אימייל וסיסמה נדרשים' },
        { status: 400 }
      );
    }

    // Find supplier by email
    const supplier = await prisma.suppliers.findUnique({
      where: {
        email: email,
      },
      include: {
        cities: true
      }
    });

    if (!supplier) {
      return NextResponse.json(
        { success: false, message: 'ספק לא נמצא עם כתובת אימייל זו' },
        { status: 404 }
      );
    }

    // For now, we'll use a simple password check
    // In a real implementation, you'd compare with hashed password
    // const isPasswordValid = await bcrypt.compare(password, supplier.password);
    
    // For demo purposes, accept any password that's not empty
    if (!password || password.length < 1) {
      return NextResponse.json(
        { success: false, message: 'סיסמה שגויה' },
        { status: 401 }
      );
    }

    // Generate JWT token
    const token = jwt.sign(
      { 
        supplierId: supplier.id,
        clerkId: supplier.clerkId,
        email: supplier.email,
        role: 'SUPPLIER'
      },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '24h' }
    );

    // Return success response with token and supplier data
    return NextResponse.json({
      success: true,
      message: 'התחברות בוצעה בהצלחה',
      data: {
        token,
        supplier: {
          id: supplier.id,
          clerkId: supplier.clerkId,
          firstName: supplier.firstName,
          lastName: supplier.lastName,
          email: supplier.email,
          phone: supplier.phone,
          cities: supplier.cities,
          createdAt: supplier.createdAt
        }
      }
    }, { status: 200 });

  } catch (error) {
    console.error('Login error:', error);
    return NextResponse.json(
      { success: false, message: 'שגיאה פנימית בשרת' },
      { status: 500 }
    );
  }
}
