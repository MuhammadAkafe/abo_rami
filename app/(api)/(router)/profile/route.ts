import { prisma } from "@/app/(lib)/prisma";
import { users } from "@/generated/prisma/client";
import { cookies } from "next/headers";
import { NextResponse } from "next/server";
import jwt from 'jsonwebtoken';


export async function GET() {
const cookieStore = await cookies();
const token = cookieStore.get('token')?.value;
const decoded = jwt.verify(token as string, process.env.PUBLIC_KEY as string);
const userId = (decoded as { userId: number }).userId;
    const user = await prisma.users.findUnique({
        where: { id: Number(userId) },
    });
    const { id, firstName, lastName, email, phone, role } = user as users;
    return NextResponse.json({ id, firstName, lastName, email, phone, role });
}