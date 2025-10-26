import { CLIENT_ROUTES } from '@/constans/constans'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'
import LoginForm from '@/app/client/Login/LoginForm'

export default async function LoginPage() {
  // Check if user is already logged in
  const cookieStore = await cookies()
  const sessionCookie = cookieStore.get('session')
  
  if (sessionCookie) {
    redirect(CLIENT_ROUTES.SUPPLIER.DASHBOARD)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-indigo-100 py-12 px-4 sm:px-6 lg:px-8" dir="rtl">
      {/* Back Button */}
      <div className="absolute top-4 right-4">
        <Link 
          href={CLIENT_ROUTES.HOME}
          className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-lg text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-colors duration-200"
        >
          <svg className="w-4 h-4 ml-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
          </svg>
          חזור לעמוד הבית
        </Link>
      </div>

      <div className="max-w-md w-full space-y-8">
        <div className="text-center">
          <div className="mx-auto h-12 w-12 flex items-center justify-center rounded-full bg-indigo-100 mb-4">
            <svg className="h-6 w-6 text-indigo-600" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
          </div>
          <h2 className="text-3xl font-bold text-gray-900">
            התחברות למערכת
          </h2>
          <p className="mt-2 text-sm text-gray-600">
            הכנס את פרטי ההתחברות שלך
          </p>
        </div>
        
        <LoginForm />
      </div>
    </div>
  )
}

