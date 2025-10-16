"use client"

import { useUser } from '@clerk/nextjs'
import LoadingComponent from '@/components/LoadingComponent';
import { useRouter } from 'next/navigation';
import { CLIENT_ROUTES } from '@/app/constans/constans';
import { Role } from '@prisma/client';
export default function CheckRolePage() 
{
    const { isSignedIn, user ,isLoaded} = useUser();
    const router = useRouter();
    if(!isLoaded || !user) {
        return <LoadingComponent message="Loading data..." />
    }

    if(!isSignedIn || !user) {
      router.push(CLIENT_ROUTES.SIGN_IN);
    }

    if(user?.publicMetadata.role === Role.ADMIN) {
        router.push(CLIENT_ROUTES.ADMIN.DASHBOARD);
    } else {
        router.push(CLIENT_ROUTES.USER.DASHBOARD);
    }
}