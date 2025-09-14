import React, { useState } from 'react'

interface TaskFilters {
  status: string;
  priority: string;
  startDate: string;
  endDate: string;
}



export default function Fillter() {
  const [filters, setFilters] = useState<TaskFilters>({
    status: '',
    priority: '',
    startDate: '',
    endDate: ''
  });

  const handleFilterChange = (key: keyof TaskFilters, value: string) => {
    const newFilters = {
      ...filters,
      [key]: value
    };
    setFilters(newFilters);

  };

  const clearFilters = () => {
    const clearedFilters = {
      status: '',
      priority: '',
      startDate: '',
      endDate: ''
    };
    setFilters(clearedFilters);
  };

  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">סינון משימות</h3>
    <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
        <select 
          value={filters.status}
          onChange={(e) => handleFilterChange('status', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">כל הסטטוסים</option>
          <option value="pending">ממתין</option>
          <option value="completed">הושלם</option>
          <option value="rejected">דחוף</option>
        </select>
      </div>

      {/* Priority Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">עדיפות</label>
        <select 
          value={filters.priority}
          onChange={(e) => handleFilterChange('priority', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="all">כל העדיפויות</option>
          <option value="low">נמוכה</option>
          <option value="medium">בינונית</option>
          <option value="high">גבוהה</option>
        </select>
      </div>

      {/* Start Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תאריך התחלה</label>
        <input
          type="date"
          value={filters.startDate}
          onChange={(e) => handleFilterChange('startDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* End Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תאריך סיום</label>
        <input
          type="date"
          value={filters.endDate}
          onChange={(e) => handleFilterChange('endDate', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
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