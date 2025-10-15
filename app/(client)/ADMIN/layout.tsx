
import { authOptions } from "@/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";
import Permission from "@/app/components/permission";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    // For all other admin routes, require authentication
    if (!session) {
        console.log("No session found, redirecting to AdminLogin");
        redirect("/AdminLogin");
    }
    if (session.user?.role !== Role.ADMIN) 
      {
       return <>
       <Permission />
       </>
    }

    return <div>{children}</div>;
}