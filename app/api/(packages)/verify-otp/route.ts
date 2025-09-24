import { NextResponse } from "next/server";
import redisClient from "@/app/lib/redis";
import { generateSecureToken } from "@/app/lib/Otp";

export async function POST(request: Request) {
    try {
        const { email, otp, isAdmin } = await request.json();
        
        // Validate input
        if (!email || !otp) {
            return NextResponse.json({ 
                error: 'Email and OTP are required' 
            }, { status: 400 });
        }

        // Validate OTP format (6 digits)
        if (!/^\d{6}$/.test(otp.toString())) {
            return NextResponse.json({ 
                error: 'OTP must be 6 digits' 
            }, { status: 400 });
        }

        const userType = isAdmin ? 'admin' : 'supplier';
        
        // Connect to Redis
        await redisClient.connect();
        
        // Check if OTP exists and is valid
        const otpKey = `otp:${email}:${userType}`;
        const storedOTP = await redisClient.get(otpKey);
        
        if (!storedOTP) {
            return NextResponse.json({ 
                error: 'OTP not found or expired. Please request a new OTP.' 
            }, { status: 404 });
        }

        // Verify OTP
        if (storedOTP !== otp.toString()) {
            return NextResponse.json({ 
                error: 'Invalid OTP. Please check and try again.' 
            }, { status: 400 });
        }

        // Get user info
        const userInfoKey = `user_info:${email}:${userType}`;
        const userInfoStr = await redisClient.get(userInfoKey);
        
        if (!userInfoStr) {
            return NextResponse.json({ 
                error: 'User information not found. Please request a new OTP.' 
            }, { status: 404 });
        }

        const userInfo = JSON.parse(userInfoStr);
        
        // Generate a secure reset token for password reset
        const resetToken = generateSecureToken();
        const resetTokenKey = `reset_token:${email}:${userType}`;
        
        // Store reset token with 10-minute expiration
        await redisClient.set(resetTokenKey, resetToken, { EX: 600 });
        
        // Clean up OTP and user info
        await redisClient.del(otpKey);
        await redisClient.del(userInfoKey);

        return NextResponse.json({
            message: 'OTP verified successfully',
            resetToken,
            email,
            userType,
            userId: userInfo.userId,
            expiresIn: '10 minutes'
        });

    } catch (error) {
        console.error('OTP verification error:', error);
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