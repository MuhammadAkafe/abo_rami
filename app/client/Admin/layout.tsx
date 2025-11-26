import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/app/constans/constans";

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    
    // Check if user is authenticated
    if (!session) {
        redirect(CLIENT_ROUTES.AdminSignIn);
    }
    
    // Check if user has ADMIN role
    if (session.role !== "ADMIN") {
        redirect(CLIENT_ROUTES.AdminSignIn);
    }

    return <>
        {children}
    </>
}