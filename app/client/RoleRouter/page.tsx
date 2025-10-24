"use client"

import { useUser } from "@clerk/nextjs"
import { useRouter } from "next/navigation"
import { useEffect, useState } from "react"
import { CLIENT_ROUTES } from "@/constans/constans"
import LoadingComponent from "@/components/LoadingComponent"

export default function RoleRouter() {
    const { user, isLoaded } = useUser()
    const router = useRouter()
    const [hasRedirected, setHasRedirected] = useState(false)

    useEffect(() => {
        if (isLoaded && !user) {
            // User is not authenticated, redirect to sign-in
            router.replace(CLIENT_ROUTES.SIGN_IN)
            return
        }

        if (isLoaded && user && !hasRedirected) {
            // Check user role from public metadata and redirect
            const userRole = user.publicMetadata?.role as string
            console.log('RoleRouter - User role:', userRole)
            
            let targetUrl: string
            if (userRole === 'ADMIN') {
                targetUrl = CLIENT_ROUTES.ADMIN.DASHBOARD
            } else if (userRole === 'USER') {
                targetUrl = CLIENT_ROUTES.USER.DASHBOARD
            } else {
                targetUrl = CLIENT_ROUTES.SIGN_IN
            }
            
            console.log('RoleRouter - Redirecting to:', targetUrl)
            setHasRedirected(true)
            router.replace(targetUrl)
        }
    }, [user, isLoaded, router, hasRedirected])

    // Show loading while processing
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
            <LoadingComponent message="מעביר לדשבורד..." />
        </div>
    )
}