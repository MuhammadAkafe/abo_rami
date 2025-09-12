import { prisma } from "@/app/(lib)/prisma";
import { NextRequest, NextResponse } from "next/server";

export async function GET(request: NextRequest) {
    const users = await prisma.users.findMany();
    return NextResponse.json(users);
}
