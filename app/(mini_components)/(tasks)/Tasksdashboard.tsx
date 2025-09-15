"use client"
import React from 'react';
import TasksTable from './TasksTable';


export default function TasksDashbaordDisplay() {


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      {/* Main Content Layout */}
      <div className="space-y-8">
        {/* Tasks Section */}
        <div className="w-full">
          <TasksTable  />
        </div>
      </div>
    </div>
  )
}


