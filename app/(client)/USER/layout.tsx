
import { authOptions } from "@/app/lib/auth";
import { getServerSession } from "next-auth/next";
import { redirect } from "next/navigation";
import { Role } from "@prisma/client";


export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const session = await getServerSession(authOptions);
    // For all other admin routes, require authentication
    if (!session) {
        console.log("No session found, redirecting to UserLogin");
        redirect("/SupplierLogin");
    }
    if (session.user?.role !== Role.USER) 
      {
       return <>
       <div className="flex justify-center items-center h-screen">
        <h1>You are not authorized to access this page</h1>
       </div>
       </>
    }

    return <div>{children}</div>;
}