import { getSession } from '@/lib/session'
import { redirect } from 'next/navigation'
import { CLIENT_ROUTES } from '@/constans/constans'
import { Suspense } from 'react'

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
  // Check authentication
  const session = await getSession()
  
  // If no session, redirect to login
  if (!session) {
    redirect(CLIENT_ROUTES.SUPPLIER.SIGN_IN)
  }

  // Verify user has SUPPLIER role
  if (session.role !== 'SUPPLIER') {
    redirect(CLIENT_ROUTES.SUPPLIER.SIGN_IN)
  }

  return (
    <Suspense fallback={<AuthLoading />}>
      <div className="min-h-screen bg-gray-50" dir="rtl">
        {/* Navigation Header */}
        <nav className="bg-white shadow-sm border-b border-gray-200">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center h-16">
              {/* Logo/Brand */}
              <div className="flex items-center">
                <h1 className="text-xl font-semibold text-gray-900">
                  מערכת ניהול ספקים
                </h1>
              </div>

              {/* User Info */}
              <div className="flex items-center space-x-4 space-x-reverse">
                <div className="text-right">
                  <p className="text-sm font-medium text-gray-900">
                    {session.firstName} {session.lastName}
                  </p>
                  <p className="text-xs text-gray-500">{session.email}</p>
                </div>
                
                {/* User Avatar */}
                <div className="h-8 w-8 rounded-full bg-indigo-500 flex items-center justify-center">
                  <span className="text-sm font-medium text-white">
                    {session.firstName.charAt(0)}
                  </span>
                </div>
              </div>
            </div>
          </div>
        </nav>

        {/* Main Content */}
        <main className="max-w-7xl mx-auto py-6 px-4 sm:px-6 lg:px-8">
          {children}
        </main>
      </div>
    </Suspense>
  )
}
