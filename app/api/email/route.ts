import { NextResponse } from "next/server";
import { prisma } from "@/app/(lib)/prisma";
import { generateOTP } from "../../(lib)/Otp";
import { sendEmail } from "../../(lib)/sendEmail";
import redisClient from "../../(lib)/redius";

const findSupplier = async (email: string) => {
    try {
        const supplier = await prisma.suppliers.findUnique({
            where: { email: email }
        });
        return supplier?.id;
    } catch (error) {
        console.error('Database error finding supplier:', error);
        throw new Error('Database connection failed');
    }
}

const findAdmin = async (email: string) => {
    try {
        const user = await prisma.users.findUnique({
            where: { 
                email: email,
            }
        });
        return user?.id;
    } 
    catch (error) 
    {
        console.error('Database error finding admin:', error);
        throw new Error('Database connection failed');
    }
}

export async function POST(request: Request) {
    try {
        const { email, isAdmin } = await request.json();
        
        // Validate input
        if (!email) {
            return NextResponse.json({ 
                error: 'Email is required' 
            }, { status: 400 });
        }

        // Validate email format
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(email)) {
            return NextResponse.json({ 
                error: 'Invalid email format' 
            }, { status: 400 });
        }

        let userId: number | undefined;
        let userType: string;

        if (isAdmin) {
            userId = await findAdmin(email);
            userType = 'admin';
        } 
        else {
            userId = await findSupplier(email);
            userType = 'supplier';
        }

        if (!userId) {
            return NextResponse.json({ 
                error: `${userType === 'admin' ? 'Admin' : 'Supplier'} not found with this email address` 
            }, { status: 404 });
        }

        // Generate OTP
        const otp = await generateOTP();
        
        // Connect to Redis
        await redisClient.connect();
        
        // Store OTP in Redis with 5-minute expiration
        const otpKey = `otp:${email}:${userType}`;
        await redisClient.set(otpKey, otp.toString(), { EX: 300 });
        
        // Store user info for verification
        const userInfoKey = `user_info:${email}:${userType}`;
        await redisClient.set(userInfoKey, JSON.stringify({ userId, userType }), { EX: 300 });
        // Send email with OTP
        try {
            await sendEmail(email, otp);
        } 
        catch (emailError) {
            console.error('Email sending failed:', emailError);
            // Don't fail the request if email fails, but log it
        }

        return NextResponse.json({
            message: 'OTP sent successfully to your email',
            email,
            userType,
            expiresIn: '5 minutes'
        });

    } catch (error) {
        console.error('API error:', error);
        return NextResponse.json({ 
            error: 'Internal server error' 
        }, { status: 500 });
    } finally {
        try {
            await redisClient.disconnect();
        } catch (disconnectError) {
            console.error('Redis disconnect error:', disconnectError);
        }
    }
} 

