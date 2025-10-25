import { verifyWebhook } from "@clerk/nextjs/webhooks";
import { NextRequest, NextResponse } from "next/server";
import { UserJSON } from "@clerk/nextjs/server";



export async function POST(req: NextRequest) {
  try {
    
    // ✅ التحقق من توقيع Clerk webhook
    const evt = await verifyWebhook(req, {
      signingSecret: process.env.CLERK_WEBHOOK_SIGNING_SECRET
    });

    // ✅ التأكد من أن الداتا تخص مستخدم
    const user = evt.data as UserJSON;

    if (!user?.id) {
      return NextResponse.json(
        { message: "User ID is required" },
        { status: 400 }
      );
    }

    return NextResponse.json(
      { message: "✅ User created successfully in Prisma" },
      { status: 200 }
    );
  } catch (err: unknown) {
    console.error("❌ Error in SignUp webhook:", err);
    return NextResponse.json({ message: "Error in SignUp webhook" }, { status: 500 });
  }
}
