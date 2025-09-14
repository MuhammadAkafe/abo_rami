import { NextResponse } from "next/server";
import { prisma } from "@/app/(lib)/prisma";
import { Suppliers, Role } from "@prisma/client";
import { registerSchema } from "@/app/validtion";
import bcrypt from "bcrypt";

// Types for better type safety
interface CreateUserData {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  phone: string;
  role: string;
}

interface ApiResponse {
  success: boolean;
  message?: string;
  user?: Partial<Suppliers>;
  errors?: Record<string, string>;
}

// Check if user already exists
async function checkUserExists(email: string): Promise<boolean> {
  const existingUser = await prisma.suppliers.findUnique({
    where: {
      email: email.toLowerCase(),
    },
  });
  return !!existingUser;
}

// Create new user
async function createUser(userData: CreateUserData): Promise<Suppliers> {
  const hashedPassword = await bcrypt.hash(userData.password, 10);
  
  return await prisma.suppliers.create({
    data: {
      email: userData.email,
      password: hashedPassword,
      firstName: userData.firstName,
      lastName: userData.lastName,
      phone: userData.phone,
      role: userData.role as Role,
    },
  });
}

export async function POST(req: Request): Promise<NextResponse<ApiResponse>> {
  try {
    // Parse and validate request body
    const body = await req.json();
    const validation = registerSchema.safeParse(body);
    if (!validation.success) {
      const errors: Record<string, string> = {};
      validation.error.issues.forEach((issue) => {
        const field = issue.path[0] as string;
        errors[field] = issue.message;
      });
      return NextResponse.json(
        { success: false, errors },
        { status: 400 }
      );
    }

    const { email } = validation.data;

    // Check if user already exists
    const userExists = await checkUserExists(email);
    if (userExists) {
      return NextResponse.json(
        { 
          success: false, 
          message: 'כתובת אימייל כבר קיימת' 
        },
        { status: 409 }
      );
    }

    // Create new user
    const newUser = await createUser(validation.data);
    
    // Return success response (exclude password from response)
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...userWithoutPassword } = newUser;
    
    return NextResponse.json({
      success: true,
      message: 'המשתמש נוצר בהצלחה',
      user: userWithoutPassword
   }, { status: 200 });

  } 
  catch (error) {

    console.error('Registration error:', error);
    
    return NextResponse.json(
      { 
        success: false, 
        message: 'אירעה שגיאה בשרת. אנא נסו שוב.' 
      },
      { status: 500 }
    );
  }
}