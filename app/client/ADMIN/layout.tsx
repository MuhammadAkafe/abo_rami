import { auth } from '@clerk/nextjs/server'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/app/constans/constans'
import { Role } from '@prisma/client'
import { currentUser } from '@clerk/nextjs/server'
export default async function AdminLayout({ children }: { children: React.ReactNode }) {
    const { userId } = await auth();
    const user = await currentUser();
    if(!userId || !user) {
        redirect(CLIENT_ROUTES.SIGN_IN)
    }
    if(user.publicMetadata.role !== Role.ADMIN) {
        redirect(CLIENT_ROUTES.UNAUTHORIZED)
    }
    return <div>{children}</div>;
}