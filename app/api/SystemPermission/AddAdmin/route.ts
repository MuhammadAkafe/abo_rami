import { prisma } from "@/app/lib/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import { registerSchema } from "@/app/validtion";

export async function POST(request: Request) {
    try {
        const body = await request.json();
        
        // Validate input using schema
        const validation = registerSchema.safeParse(body);
        if (!validation.success) {
            const errors: Record<string, string> = {};
            validation.error.issues.forEach((issue) => {
                const field = issue.path[0] as string;
                errors[field] = issue.message;
            });
            return NextResponse.json(
                { error: "Validation failed", errors },
                { status: 400 }
            );
        }

        const { email, password: userPassword, confirmPassword, firstName, lastName, phone, role } = validation.data;

        // Check if passwords match
        if (userPassword !== confirmPassword) {
            return NextResponse.json(
                { error: "Passwords do not match" },
                { status: 400 }
            );
        }

        // Check if user already exists
        const existingUser = await prisma.users.findUnique({
            where: { email: email.toLowerCase() }
        });
        
        if (existingUser) {
            return NextResponse.json(
                { error: "כתובת אימייל כבר קיימת" },
                { status: 409 }
            );
        }

        // Hash password and create user
        const hashedPassword = await bcrypt.hash(userPassword, 10);
        
        const newUser = await prisma.users.create({
            data: {
                email: email.toLowerCase(),
                password: hashedPassword,
                firstName,
                lastName,
                phone,
                role: role || 'ADMIN'
            }
        });

        // Return success response (exclude password)
        const userWithoutPassword = {
            id: newUser.id,
            email: newUser.email,
            firstName: newUser.firstName,
            lastName: newUser.lastName,
            phone: newUser.phone,
            role: newUser.role,
            createdAt: newUser.createdAt
        };
        
        return NextResponse.json({
            success: true,
            message: "המשתמש נוצר בהצלחה",
            user: userWithoutPassword
        }, { status: 201 });

    } catch (error) {
        console.error('Registration error:', error);
        return NextResponse.json(
            { error: "אירעה שגיאה בשרת. אנא נסו שוב." + error },
            { status: 500 }
        );
    }
}
