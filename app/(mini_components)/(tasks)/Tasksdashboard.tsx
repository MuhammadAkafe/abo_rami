"use client"
import React from 'react';
import Tasks from './Tasks';


export default function TasksDashbaordDisplay() {


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      {/* Main Content Layout */}
      <div className="space-y-8">
        {/* Tasks Section */}
        <div className="w-full">
          <Tasks  />
        </div>
      </div>
    </div>
  )
}


