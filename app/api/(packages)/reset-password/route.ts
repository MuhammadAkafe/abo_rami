import { NextResponse } from "next/server";
import { prisma } from "@/app/lib/prisma";
import redisClient from "@/app/lib/redis";
import bcrypt from 'bcryptjs';

export async function POST(request: Request) {
    try {
        const { email, newPassword, resetToken, isAdmin } = await request.json();
        
        // Validate input
        if (!email || !newPassword || !resetToken) {
            return NextResponse.json({ 
                error: 'Email, new password, and reset token are required' 
            }, { status: 400 });
        }

        // Validate password strength
        if (newPassword.length < 6) {
            return NextResponse.json({ 
                error: 'Password must be at least 6 characters long' 
            }, { status: 400 });
        }

        const userType = isAdmin ? 'admin' : 'supplier';
        
        // Connect to Redis
        await redisClient.connect();
        
        // Verify reset token
        const resetTokenKey = `reset_token:${email}:${userType}`;
        const storedToken = await redisClient.get(resetTokenKey);
        
        if (!storedToken) {
            return NextResponse.json({ 
                error: 'Reset token not found or expired. Please request a new password reset.' 
            }, { status: 404 });
        }

        if (storedToken !== resetToken) {
            return NextResponse.json({ 
                error: 'Invalid reset token. Please verify your OTP again.' 
            }, { status: 400 });
        }

        // Hash the new password
        const saltRounds = 12;
        const hashedPassword = await bcrypt.hash(newPassword, saltRounds);

        // Update password in database
        let updatedUser;
        if (isAdmin) {
            updatedUser = await prisma.users.update({
                where: { 
                    email: email,
                    role: 'ADMIN'
                },
                data: { password: hashedPassword }
            });
        } else {
            updatedUser = await prisma.suppliers.update({
                where: { email: email },
                data: { password: hashedPassword }
            });
        }

        if (!updatedUser) {
            return NextResponse.json({ 
                error: 'Failed to update password. Please try again.' 
            }, { status: 500 });
        }

        // Clean up reset token
        await redisClient.del(resetTokenKey);

        return NextResponse.json({
            message: 'Password updated successfully',
            email,
            userType
        });

    } catch (error) {
        console.error('Password reset error:', error);
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
