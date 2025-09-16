import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";


export async function GET(req: Request) {
    try{
    const users = await prisma.users.findMany(
        {
            where: {
                role: "USER"
            }
        }
    );
    return NextResponse.json(users);
    }
    catch (error) {
        console.error("Error getting users:", error);
        return NextResponse.json({ error: "Users not found" }, { status: 500 });
    }
}