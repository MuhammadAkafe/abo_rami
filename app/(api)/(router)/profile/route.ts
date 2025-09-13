import { prisma } from "@/app/(lib)/prisma";
import { users } from "@/generated/prisma/client";
import { NextResponse } from "next/server";




export async function POST(request: Request) {
    try {
    const { userId } = await request.json();
    if (!userId) {
        return NextResponse.json({ error: "User ID is required" }, { status: 400 });
    }

    const user = await prisma.users.findUnique({
        where: { id: Number(userId) },
    });
    if (!user) {
        return NextResponse.json({ error: "User not found" }, { status: 404 });
    }
        const { id, firstName, lastName, email, phone, role } = user as users;
        return NextResponse.json({ id, firstName, lastName, email, phone, role });
    } catch (error) {
        console.error('Error fetching user profile:', error);
        return NextResponse.json({ error: "Internal server error" }, { status: 500 });
    }
}