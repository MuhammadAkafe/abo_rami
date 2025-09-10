"use client"


export default function ControlPanel({user}: {user: {firstName: string, role: string}}) {
    return (
        <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-gray-900">לוח בקרה</h1>
              <p className="text-gray-600">ברוך הבא, {user.firstName}!</p>
            </div>
            <div className="flex items-center space-x-4 ">
              <span className="text-sm text-gray-500">
                {user.role === 'ADMIN' ? 'מנהל' : 'משתמש'}
              </span>
              <form action="/logout" method="post" className="mr-4">
                <button
                  type="submit"
                  className="bg-red-600 text-white px-4 py-2 rounded-md hover:bg-red-700 transition-colors"
                >
                  התנתק
                </button>
              </form>
            </div>
          </div>
        </div>
      </header>
    )
}