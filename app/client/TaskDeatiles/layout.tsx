import { getSession, SessionData } from "@/lib/session";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { SessionProvider } from "../SesstionProvider";

export default async function TaskDetailsLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    // Allow both ADMIN and USER roles to access task details
    if (session && session.role !== "USER" && session.role !== "ADMIN") {
        redirect(CLIENT_ROUTES.HOME);
    }
    return (
        <div>
            <SessionProvider session={session as unknown as SessionData}>
                {children}
            </SessionProvider>
        </div>
    )
}