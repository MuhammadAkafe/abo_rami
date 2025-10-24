"use client"

import { CLIENT_ROUTES } from "@/constans/constans";
import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import LoadingComponent from "@/components/LoadingComponent";

export default function UserLayout({ children }: { children: React.ReactNode }) {

    const { user, isLoaded } = useUser();
    const router = useRouter();

    // Determine sync authorization state so we don't render children before role check
    const isAuthorized = isLoaded && !!user && user.publicMetadata?.role === 'USER';

    useEffect(() => {
        if (isLoaded) {
            if (!user || (user.publicMetadata?.role !== 'USER' && user.publicMetadata?.role !== 'ADMIN')) {
                router.replace(CLIENT_ROUTES.HOME);
                return;
            }
            if(user && user.publicMetadata?.role !== 'USER') {
                router.replace(CLIENT_ROUTES.SIGN_IN);
                return;
            }
        }
    }, [isLoaded, user, router])

    // While loading user or waiting for redirect, show loading to avoid flashing wrong page
    if (!isLoaded) {
        return <><LoadingComponent message="Loading ..." /></>
    }

    if (!isAuthorized) {
        // user is loaded but not authorized for USER area — effect will redirect; show loader
        return <><LoadingComponent message="Redirecting ..." /></>
    }

    // Authorized USER — render children
    return <>{children}</>;
}