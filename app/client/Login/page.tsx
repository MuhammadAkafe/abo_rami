import { loginAction } from '@/app/actions/auth'
import { CLIENT_ROUTES } from '@/constans/constans'
import { redirect } from 'next/navigation'
import { cookies } from 'next/headers'
import Link from 'next/link'

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

async function handleLogin(formData: FormData) {
  'use server'
  
  try {
    await loginAction(formData)
  } catch (error) {
    // Check if it's a Next.js redirect error (which is expected and should not be logged)
    if (error instanceof Error && error.message === 'NEXT_REDIRECT') {
      throw error // Re-throw redirect errors to let Next.js handle them
    }
    
    // Handle actual login errors
    console.error('Login failed:', error)
  }
}

function LoginForm() {
  return (
    <div className="bg-white py-8 px-6 shadow-xl rounded-lg border border-gray-200">
      <form action={handleLogin} className="space-y-6" dir="rtl">
        <div className="space-y-4">
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
              כתובת אימייל
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 12a4 4 0 10-8 0 4 4 0 008 0zm0 0v1.5a2.5 2.5 0 005 0V12a9 9 0 10-9 9m4.5-1.206a8.959 8.959 0 01-4.5 1.207" />
                </svg>
              </div>
              <input
                id="email"
                name="email"
                type="email"
                autoComplete="email"
                required
                className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="example@email.com"
                dir="ltr"
              />
            </div>
          </div>
          
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
              סיסמה
            </label>
            <div className="relative">
              <div className="absolute inset-y-0 right-0 pr-3 flex items-center pointer-events-none">
                <svg className="h-5 w-5 text-gray-400" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                </svg>
              </div>
              <input
                id="password"
                name="password"
                type="password"
                autoComplete="current-password"
                required
                className="block w-full pr-10 pl-4 py-3 border border-gray-300 rounded-lg text-gray-900 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors duration-200"
                placeholder="הכנס סיסמה"
                dir="ltr"
              />
            </div>
          </div>
        </div>

        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <input
              id="remember-me"
              name="remember-me"
              type="checkbox"
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <label htmlFor="remember-me" className="mr-2 block text-sm text-gray-900">
              זכור אותי
            </label>
          </div>

          <div className="text-sm">
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              שכחת סיסמה?
            </a>
          </div>
        </div>

        <div>
          <button
            type="submit"
            className="group relative w-full flex justify-center items-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 transition-all duration-200 transform hover:scale-[1.02]"
          >
            <span className="absolute right-0 inset-y-0 flex items-center pr-3">
              <svg className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400 transition-colors duration-200" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
              </svg>
            </span>
            התחבר למערכת
          </button>
        </div>

        <div className="text-center">
          <p className="text-sm text-gray-600">
            אין לך חשבון?{' '}
            <a href="#" className="font-medium text-indigo-600 hover:text-indigo-500 transition-colors duration-200">
              צור קשר עם המנהל
            </a>
          </p>
        </div>
      </form>
    </div>
  )
}
