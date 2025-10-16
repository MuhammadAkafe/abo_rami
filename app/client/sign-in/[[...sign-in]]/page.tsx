"use client"
import { SignIn } from '@clerk/nextjs'
import { CLIENT_ROUTES } from '@/app/constans/constans'
export default function SignInPage() 
{
    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100 flex items-center justify-center" dir="rtl">
            <div className="bg-white rounded-xl shadow-lg p-8">
                <SignIn forceRedirectUrl={CLIENT_ROUTES.CHECK_ROLE} />
            </div>
        </div>
    )
}