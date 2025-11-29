import { getSession } from "@/lib/session";
import { redirect } from "next/navigation";
import { CLIENT_ROUTES } from "@/app/constans/constans";
import { SessionProvider } from "../SesstionProvider";

export default async function TaskDetailsLayout({ children }: { children: React.ReactNode }) {
    const session = await getSession();
    if (!session) {
        redirect(CLIENT_ROUTES.USER.SIGN_IN);
    }
    return (
        <div>
            <SessionProvider session={session}>
                {children}
            </SessionProvider>
        </div>
    )
}