interface LinkProps {
    link: string;
    isAdmin: boolean;
    isCopied: boolean;
    handleCopyLink: () => void;
}
export default function Link({link, isAdmin, isCopied, handleCopyLink}: LinkProps) {
    return (<>
        {/* Signature Link Section - Only for Admin */}
        {isAdmin && (
            <div className="bg-white rounded-xl shadow-lg p-6 mb-6">
              <h2 className="text-xl font-semibold text-gray-900 mb-4">קישור לחתימת המשימה</h2>
              <div className="flex items-center gap-3">
                <div className="flex-1 bg-gray-50 border border-gray-300 rounded-lg px-4 py-3 flex items-center">
                  <input
                    type="text"
                    value={link}
                    readOnly
                    className="flex-1 bg-transparent text-sm text-gray-700 outline-none"
                    dir="ltr"
                  />
                </div>
                <button
                  onClick={handleCopyLink}
                  className="flex items-center gap-2 px-4 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium text-sm"
                  title="העתק קישור"
                >
                  {isCopied ? (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
                      </svg>
                      הועתק
                    </>
                  ) : (
                    <>
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v2m-6 12h8a2 2 0 002-2v-8a2 2 0 00-2-2h-8a2 2 0 00-2 2v8a2 2 0 002 2z" />
                      </svg>
                      העתק
                    </>
                  )}
                </button>
                <a
                  href={link}
                  target="_self"
                  rel="noopener noreferrer"
                  className="flex items-center gap-2 px-4 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors font-medium text-sm"
                  title="פתח קישור בחלון חדש"
                >
                  <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                  </svg>
                  פתח
                </a>
              </div>
              <p className="mt-3 text-sm text-gray-500">שלח קישור זה לספק כדי שיוכל לחתום על המשימה</p>
            </div>
          )}
        </>
    )
}