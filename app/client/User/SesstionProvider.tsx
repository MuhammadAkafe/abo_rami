"use client";

import { SessionData } from "@/lib/session";
import { createContext, useContext } from "react";


const SessionContext = createContext<SessionData | null>(null);


export const useSession = () => {
    return useContext(SessionContext);
}

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: SessionData | null }) => {
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}