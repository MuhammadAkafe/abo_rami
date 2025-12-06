"use client";

import { createContext, useContext, useEffect } from "react";
import { SessionData } from "@/lib/session";
import { useRouter } from "next/navigation";
import { CLIENT_ROUTES } from "../constans/constans";
const SessionContext = createContext<SessionData | null>(null);


export const useSession = (): SessionData | null => {
    const router = useRouter();
    const session = useContext(SessionContext);
    
    useEffect(() => {
        if (!session) {
            router.push(CLIENT_ROUTES.HOME);
        }
    }, [session, router]);
    
    return session;
}

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: SessionData | null }) => {

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}