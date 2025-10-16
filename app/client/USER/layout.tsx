import { auth, currentUser } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/app/constans/constans'
import { Role } from '@prisma/client'
export default async function UserLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    const user = await currentUser();
    if(!userId || !user || user.publicMetadata.role !== Role.USER) {
        redirect(CLIENT_ROUTES.SIGN_IN)
    }

    if(user.publicMetadata.role !== Role.USER) {
        redirect(CLIENT_ROUTES.UNAUTHORIZED)
    }
    return <div>{children}</div>;
}

