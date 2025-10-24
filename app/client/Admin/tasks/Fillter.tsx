import React from 'react'
import { TaskFilters, Status } from '@/types/types'

interface FilterProps {
  onFiltersChange?: (filters: TaskFilters) => void;
  clearFilters?: () => void;
  filters: TaskFilters;
  setFilters: (filters: TaskFilters) => void;
}

export default function Filter({ onFiltersChange, clearFilters, filters, setFilters }: FilterProps) 
{


  return (
    <div className="bg-white rounded-lg shadow-sm p-6 mb-6">
    <h3 className="text-lg font-semibold text-gray-900 mb-4">סינון משימות</h3>
    <form className="grid grid-cols-1 md:grid-cols-4 gap-4">
      {/* Status Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">סטטוס</label>
        <select 
          value={filters.status}
          onChange={(e) => {
            const newFilters = { ...filters, status: e.target.value as Status };
            setFilters(newFilters);
            onFiltersChange?.(newFilters);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        >
          <option value="ALL">כל הסטטוסים</option>
          <option value="PENDING">ממתין</option>
          <option value="COMPLETED">הושלם</option>
          <option value="REJECTED">נדחה</option>
        </select>
      </div>


      {/* Start Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תאריך התחלה</label>
        <input
          type="date"
          value={filters.startDate as string}
          onChange={(e) => {
            const newFilters = { ...filters, startDate: e.target.value as string };
            setFilters(newFilters);
            onFiltersChange?.(newFilters);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>

      {/* End Date Filter */}
      <div>
        <label className="block text-sm font-medium text-gray-700 mb-2">תאריך סיום</label>
        <input
          type="date"
          value={filters.endDate as string}
          min={filters.startDate as string}
          onChange={(e) => {
            const newFilters = { ...filters, endDate: e.target.value as string };
            setFilters(newFilters);
            onFiltersChange?.(newFilters);
          }}
          className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
        />
      </div>


      <div className="col-span-full flex justify-end space-x-2 mt-4">
        <button 
          type="button"
          onClick={clearFilters} 
          className="px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 border border-gray-300 rounded-md hover:bg-gray-200 focus:outline-none focus:ring-2 focus:ring-blue-500 cursor-pointer"
        >
          נקה סינון
        </button>
      </div>
    </form>
  </div>
  )
}