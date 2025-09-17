import Link from "next/link";

export default function Home() {
  return (

    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 flex items-center justify-center p-4">
      <div className="max-w-md w-full text-center space-y-8">
        {/* Header */}
        <div>
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            ברוכים הבאים למערכת ניהול משימות
          </h1>
          <p className="text-lg text-gray-600">
            המסע שלכם מתחיל כאן
          </p>
        </div>

        {/* Navigation Cards */}
        <div className="space-y-4">
          <Link 
            href="/AdminLogin"
            className="block w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-100"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">כניסה מנהלים</h3>
              <p className="text-gray-600">גשו לחשבון שלכם</p>
            </div>
          </Link>


          <div className="space-y-4">
          <Link 
            href="/Login"
            className="block w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-100"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">כניסה ספקים</h3>
              <p className="text-gray-600">גשו לחשבון שלכם</p>
            </div>
          </Link>

          <Link 
            href="/Register"
            className="block w-full bg-white rounded-xl shadow-lg p-6 hover:shadow-xl transition-all duration-200 transform hover:scale-105 border border-gray-100"
          >
            <div className="text-center">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">הירשמו</h3>
              <p className="text-gray-600">צרו חשבון חדש</p>
            </div>
          </Link>
        </div>

      </div>
    </div>
    </div>
  );
}
