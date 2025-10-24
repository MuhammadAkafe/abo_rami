import { NextRequest, NextResponse } from 'next/server';
import { NewSupplier } from '@/types/types';
import { registerSchema } from '@/app/client/validtion';
import { clerkClient } from '@clerk/nextjs/server';
import { prisma } from '@/lib/prisma';

interface ClerkError {
  code: string;
  message: string;
}

interface ClerkErrorResponse {
  errors: ClerkError[];
}

export async function POST(request: NextRequest) {
  try {
    console.log("Starting supplier creation process...");
    console.log("Environment check:", {
      NODE_ENV: process.env.NODE_ENV,
      DATABASE_URL: process.env.DATABASE_URL ? "Set" : "Not set",
      CLERK_SECRET_KEY: process.env.CLERK_SECRET_KEY ? "Set" : "Not set",
      CLERK_PUBLISHABLE_KEY: process.env.CLERK_PUBLISHABLE_KEY ? "Set" : "Not set"
    });
    
    const { firstName, lastName, email, phone, password, confirmPassword, cities }: NewSupplier = await request.json();
    console.log("Received supplier data:", { firstName, lastName, email, phone: phone ? "***" : "null", cities: cities?.length || 0 });
    
    // Validate form data
    const validation = registerSchema.safeParse({ firstName, lastName, email, phone, password, confirmPassword });
    if (!validation.success) {
      console.error("Validation failed:", validation.error.message);
      return NextResponse.json({ success: false, message: validation.error.message }, { status: 400 });
    }

    console.log("Validation passed, initializing Clerk client...");
    const clerkclient = await clerkClient();
    console.log("Clerk client initialized successfully");

    // Check if user already exists in Clerk
    try {
      console.log("Checking if user exists in Clerk...");
      const existingClerkUser = await clerkclient.users.getUserList({
        emailAddress: [email]
      });
      
      if (existingClerkUser.data.length > 0) {
        console.log("User already exists in Clerk");
        return NextResponse.json({ success: false, message: "User already exists in Clerk" }, { status: 400 });
      }
      console.log("User doesn't exist in Clerk, proceeding with creation");
    } catch (error) {
      console.error("Error checking Clerk user existence:", error);
      // If user doesn't exist, continue with creation
      console.log("User doesn't exist in Clerk, proceeding with creation");
    }

    // Check if user already exists in Prisma
    console.log("Checking if user exists in database...");
    const existingPrismaUser = await prisma.users.findUnique({
      where: { email: email }
    });

    if (existingPrismaUser) {
      console.log("User already exists in database");
      return NextResponse.json({ success: false, message: "User already exists in database" }, { status: 400 });
    }
    console.log("User doesn't exist in database, proceeding with creation");

    // Create user in Clerk
    console.log("Creating user in Clerk...");
    const clerkUser = await clerkclient.users.createUser({
      emailAddress: [email],
      firstName: firstName,
      lastName: lastName,
      password: password,
    });

    if (!clerkUser) {
      console.error("Failed to create user in Clerk - no user returned");
      return NextResponse.json({ success: false, message: "Error creating user in Clerk" }, { status: 400 });
    }
    console.log("User created in Clerk successfully:", clerkUser.id);

    // Create user in Prisma
    console.log("Creating user in database...");
    const prismaUser = await prisma.users.create({
      data: {
        clerkid: clerkUser.id,
        firstName: firstName,
        lastName: lastName,
        email: email,
        phone: phone || null,
      }
    });

    console.log(`Supplier created successfully: ${prismaUser.id} (Clerk ID: ${clerkUser.id})`);

    // Update user metadata in Clerk to set role as USER
    console.log("Updating user metadata in Clerk...");
    await clerkclient.users.updateUserMetadata(clerkUser.id, {
      publicMetadata: {
        role: "USER"
      }
    });
    console.log("User metadata updated successfully");

    // Add cities to the database
    if (cities && cities.length > 0) {
      console.log(`Adding ${cities.length} cities to database...`);
      await prisma.cities.createMany({
        data: cities.map(city => ({
          clerkId: clerkUser.id,
          city: city,
        }))
      });
      console.log("Cities added successfully");
    }

    return NextResponse.json({ 
      success: true, 
      message: "Supplier added successfully",
      userId: prismaUser.id,
      clerkid: clerkUser.id
    }, { status: 200 });
  }
  catch (error: unknown) {
    console.error("Error adding supplier:", error);
    console.error("Error type:", typeof error);
    console.error("Error details:", JSON.stringify(error, null, 2));
    
    // Handle specific Clerk errors
    if (error && typeof error === 'object' && 'errors' in error) {
      const clerkErrorResponse = error as ClerkErrorResponse;
      console.error("Clerk error response:", clerkErrorResponse);
      
      if (Array.isArray(clerkErrorResponse.errors) && clerkErrorResponse.errors.length > 0) {
        const clerkError = clerkErrorResponse.errors[0];
        console.error("Clerk error:", clerkError);
        
        if (clerkError.code === 'form_password_pwned') {
          return NextResponse.json({ 
            success: false, 
            message: "Password has been found in an online data breach. For account safety, please use a different password." 
          }, { status: 400 });
        }
        if (clerkError.code === 'form_password_validation_failed') {
          return NextResponse.json({ 
            success: false, 
            message: "Password does not meet security requirements." 
          }, { status: 400 });
        }
        if (clerkError.code === 'form_identifier_exists') {
          return NextResponse.json({ 
            success: false, 
            message: "User already exists in Clerk" 
          }, { status: 400 });
        }
        // Return the specific Clerk error message
        return NextResponse.json({ 
          success: false, 
          message: clerkError.message || "Clerk error occurred" 
        }, { status: 400 });
      }
    }
    
    // Handle Prisma errors
    if (error && typeof error === 'object' && 'code' in error) {
      const prismaError = error as { code: string; message: string };
      console.error("Prisma error:", prismaError);
      
      if (prismaError.code === 'P2002') {
        return NextResponse.json({ 
          success: false, 
          message: "User with this email already exists" 
        }, { status: 400 });
      }
      if (prismaError.code === 'P1001') {
        return NextResponse.json({ 
          success: false, 
          message: "Database connection failed" 
        }, { status: 500 });
      }
      // Return the specific Prisma error message
      return NextResponse.json({ 
        success: false, 
        message: prismaError.message || "Database error occurred" 
      }, { status: 500 });
    }
    
    // Handle other specific errors
    if (error && typeof error === 'object' && 'message' in error) {
      const errorWithMessage = error as { message: string };
      console.error("General error:", errorWithMessage.message);
      
      if (typeof errorWithMessage.message === 'string' && errorWithMessage.message.includes('already exists')) {
        return NextResponse.json({ 
          success: false, 
          message: errorWithMessage.message 
        }, { status: 400 });
      }
      
      // Return the specific error message
      return NextResponse.json({ 
        success: false, 
        message: errorWithMessage.message 
      }, { status: 500 });
    }
    
    // Handle network/connection errors
    if (error && typeof error === 'object' && 'name' in error) {
      const networkError = error as { name: string; message: string };
      console.error("Network error:", networkError);
      
      if (networkError.name === 'FetchError' || networkError.name === 'NetworkError') {
        return NextResponse.json({ 
          success: false, 
          message: "Network error occurred. Please check your connection and try again." 
        }, { status: 500 });
      }
    }
    
    // Generic error response with more details
    return NextResponse.json({ 
      success: false, 
      message: `Error adding supplier. Please try again. Error: ${error instanceof Error ? error.message : 'Unknown error'}` 
    }, { status: 500 });
  }
}