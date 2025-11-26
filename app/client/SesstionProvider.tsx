"use client";

import { createContext, useContext } from "react";

const SessionContext = createContext<string | null>(null);


export const useSession = () => 
    {
    return useContext(SessionContext);
}

export const SessionProvider = ({ children, session }: { children: React.ReactNode; session: string | null }) => {
    return (
        <SessionContext.Provider value={session}>
            {children}
        </SessionContext.Provider>
    )
}