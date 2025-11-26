
import { Suspense } from 'react'
import { getSession } from '@/lib/session'
import { SessionProvider } from './SesstionProvider'
import { CLIENT_ROUTES } from '@/app/constans/constans'
import { redirect } from 'next/navigation'
// Loading component for authentication check
function AuthLoading() {
  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50" dir="rtl">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600 mx-auto mb-4"></div>
        <p className="text-gray-600">בודק הרשאות...</p>
      </div>
    </div>
  )
}

export default async function UserLayout({
  children,
}: {
  children: React.ReactNode
}) {

  const session = await getSession();
  if (!session) {
    redirect(CLIENT_ROUTES.USER.SIGN_IN);
  }

  return (
    <Suspense fallback={<AuthLoading />}>
      <SessionProvider session={session}>
        {children}
      </SessionProvider>
    </Suspense>
  );
}
