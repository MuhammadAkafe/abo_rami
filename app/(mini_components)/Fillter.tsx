import React from 'react'

export default function Fillter() {
  const clearFilters = () => {
    console.log('clearFilters')
  }
  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">סינון משימות</h3>
    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="ALL">כל הסטטוסים</option>
          <option value="PENDING">ממתין</option>
          <option value="COMPLETED">הושלם</option>
          <option value="REJECTED">נדחה</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
        <select className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500">
          <option value="LOW">נמוך</option>
          <option value="MEDIUM">בינונית</option>
          <option value="HIGH">גבוהה</option>
        </select>
      </div>

      {/* Date Range Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">טווח תאריכים</label>
        <div className="relative">
          <input
            type="date"
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
          />
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
            <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
          </div>
        </div>
      </div>
    </div>

    {/* Clear Filters Button */}
    <div className="mt-4 flex justify-end">
      <button onClick={clearFilters} className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500">
        נקה סינון
      </button>
    </div>
  </div>
  )
}