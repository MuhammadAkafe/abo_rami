import { getSession } from "@/lib/session";
import { SessionProvider } from "../SesstionProvider";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { SessionData } from "@/lib/session";


export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
  
    // Check if user has USER role
    if (session && session.role !== "USER") {
        redirect(CLIENT_ROUTES.USER.SIGN_IN);
    }
    
    return (
        <SessionProvider session={session as unknown as SessionData}>
            {children}
        </SessionProvider>
    )
}