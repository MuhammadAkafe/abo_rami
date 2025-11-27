"use client";

import { createContext, useContext } from "react";
import { SessionData } from "@/lib/session";

const SessionContext = createContext<SessionData | null>(null);


export const useSession = () => 
    {
    return useContext(SessionContext);
}

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: SessionData | null }) => {

    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}