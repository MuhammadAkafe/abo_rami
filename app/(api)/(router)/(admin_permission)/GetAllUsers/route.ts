import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";


export async function GET(request: Request) {
    const users = await prisma.suppliers.findMany(
        {
            where: {
                role: "USER"
            }
        }
    );
    if (!users) {
        return NextResponse.json({ error: "Users not found" }, { status: 404 });
    }
    return NextResponse.json(users);
}