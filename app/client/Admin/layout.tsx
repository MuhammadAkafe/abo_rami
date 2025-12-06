import { getSession, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { SessionProvider } from "../SesstionProvider";

// Mark as dynamic since it uses cookies for authentication
export const dynamic = 'force-dynamic';

export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    

    // Check if user has ADMIN role
    if (session && session.role !== "ADMIN") {
        redirect(CLIENT_ROUTES.AdminSignIn);
    }

    return <>
        <SessionProvider session={session as unknown as SessionData}>
            {children}
        </SessionProvider>
    </>
}