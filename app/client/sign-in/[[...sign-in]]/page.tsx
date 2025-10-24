"use client"

import { CLIENT_ROUTES } from "@/constans/constans"
import { SignIn } from "@clerk/nextjs"
import Link from "next/link"

export default function SignInPage() {

    return (
        <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100" dir="rtl">
            {/* Header with Back Button */}
            <header className="bg-white/80 backdrop-blur-sm shadow-sm border-b border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="flex items-center py-4">
                        <Link 
                            href={CLIENT_ROUTES.HOME}
                            className="flex items-center gap-2 text-gray-600 hover:text-gray-900 transition-colors duration-200"
                        >
                            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                            </svg>
                            <span className="font-medium">חזרה לעמוד הבית</span>
                        </Link>
                    </div>
                </div>
            </header>

            {/* Main Content */}
            <main className="flex-1 flex items-center justify-center py-12">
                <div className="w-full max-w-md">
                    <div className="text-center mb-8">
                        <h1 className="text-3xl font-bold text-gray-900 mb-2">התחברות למערכת</h1>
                        <p className="text-gray-600">התחברו לחשבון שלכם כדי להמשיך</p>
                    </div>

                    <div className="bg-white/80 backdrop-blur-sm rounded-2xl shadow-xl p-8">
                        <SignIn 
                            redirectUrl={CLIENT_ROUTES.ROLE_ROUTER}
                            appearance={{
                                elements: {
                                    formButtonPrimary: 'bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-4 rounded-lg transition-colors duration-200',
                                    card: 'shadow-none bg-transparent',
                                    headerTitle: 'text-2xl font-bold text-gray-900 text-center mb-4',
                                    headerSubtitle: 'text-gray-600 text-center mb-6',
                                    socialButtonsBlockButton: 'border border-gray-300 hover:bg-gray-50 transition-colors duration-200',
                                    formFieldInput: 'border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    footerActionLink: 'text-blue-600 hover:text-blue-700 font-medium',
                                    identityPreviewText: 'text-gray-600',
                                    formFieldLabel: 'text-gray-700 font-medium mb-1',
                                    dividerLine: 'bg-gray-300',
                                    dividerText: 'text-gray-500',
                                    formResendCodeLink: 'text-blue-600 hover:text-blue-700',
                                    otpCodeFieldInput: 'border border-gray-300 rounded-lg px-3 py-2 text-center focus:ring-2 focus:ring-blue-500 focus:border-blue-500',
                                    formFieldSuccessText: 'text-green-600',
                                    formFieldErrorText: 'text-red-600',
                                    identityPreviewEditButton: 'text-blue-600 hover:text-blue-700',
                                    formHeaderTitle: 'text-2xl font-bold text-gray-900',
                                    formHeaderSubtitle: 'text-gray-600',
                                    formFieldInputShowPasswordButton: 'text-gray-500 hover:text-gray-700',
                                    formFieldInputShowPasswordIcon: 'w-5 h-5',
                                    formFieldInputHidePasswordButton: 'text-gray-500 hover:text-gray-700',
                                    formFieldInputHidePasswordIcon: 'w-5 h-5',
                                    formFieldInputShowPasswordButtonIcon: 'w-5 h-5',
                                    formFieldInputHidePasswordButtonIcon: 'w-5 h-5',
                                }
                            }}
                        />
                    </div>

                    {/* Additional Info */}
                    <div className="text-center mt-6">
                        <p className="text-sm text-gray-600">
                            אין לכם חשבון?{' '}
                            <Link 
                                href={CLIENT_ROUTES.SIGN_UP}
                                className="text-blue-600 hover:text-blue-700 font-medium transition-colors duration-200"
                            >
                                הירשמו כאן
                            </Link>
                        </p>
                    </div>
                </div>
            </main>

            {/* Footer */}
            <footer className="bg-white/60 backdrop-blur-sm border-t border-gray-200">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
                    <div className="text-center text-gray-600">
                        <p className="text-sm">&copy; 2024 מערכת ניהול ספקים. כל הזכויות שמורות.</p>
                    </div>
                </div>
            </footer>
        </div>
    )
}
