
import { authOptions } from "@/app/lib/auth";
import { Role } from "@prisma/client";
import getServerSession from "next-auth/next";
import { redirect } from "next/navigation";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    console.log("session:", session);
    if (session?.user?.role !== Role.ADMIN) 
        {
        return redirect("/ADMIN/AdminLogin");
    }

  return <div>{children}</div>;
}