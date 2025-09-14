import { prisma } from "@/app/(lib)/prisma";
import { NextResponse } from "next/server";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { cookies } from "next/headers";
import dotenv from "dotenv";
dotenv.config();

export async function POST(req: Request) {
  try {
  const { email, password } = await req.json();
  const user = await prisma.suppliers.findUnique({
    where: { email },
  });
  if (!user) {
    return NextResponse.json({ error: "User not found" }, { status: 404 });
  }
  const isPasswordValid = await bcrypt.compare(password, user.password);
  if (!isPasswordValid) {
    return NextResponse.json({ error: "Invalid password" }, { status: 401 });
  }
  const jwt_secret = process.env.PRIVATE_KEY as string;
  if (!jwt_secret) {
    return NextResponse.json({ error: "JWT secret not found" }, { status: 500 });
  }
  const token = jwt.sign({ userId: user.id }, jwt_secret, { expiresIn: '1h' ,algorithm: 'RS256'});
  const response = NextResponse.json({ 
    message: "Login successful", 
    role: user.role,
    userid: user.id,
    redirectTo: user.role === 'ADMIN' ? '/dashboard' : '/Tasklist'
  }, { status: 200 });
  response.cookies.set('token', token, { httpOnly: true, secure: true, maxAge: 3600000, sameSite: 'strict' });

  return response;
  } 
  catch (error) {
    console.error('Login error:', error);
    return NextResponse.json({ error: "Internal server error" }, { status: 500 });
  }
}
