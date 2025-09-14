"use client"
import React from 'react';
import Fillter from '../Fillter';
import Tasks from './Tasks';
import TasksStatus from './TasksStatus';


export default function TasksDashbaordDisplay() {


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      {/* Main Content Layout */}
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="w-full">
          <TasksStatus  />
        </div>
        {/* Tasks Section */}
        <div className="w-full">
          <Tasks  />
        </div>
      </div>
    </div>
  )
}


