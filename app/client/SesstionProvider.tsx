"use client";

import { createContext, useContext } from "react";
import { SessionData } from "@/lib/session";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "../constans/constans";
const SessionContext = createContext<SessionData | null>(null);


export const useSession = (): SessionData | null => 
    {
    const router = useRouter();
    const session = useContext(SessionContext);
    if (!session) {
        router.push(CLIENT_ROUTES.HOME);
        return null;
    }
    return session;
}

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: SessionData | null }) => {

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}