"use client"
import React from 'react';
import Fillter from './Fillter';
import TasksTable from './TasksTable';


export default function TaskManagement() {

  return (
    <>
        <div className="w-full">
          <Fillter />
        </div>
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
      {/* Header */}
      <div className="px-6 py-4 border-b border-gray-200 bg-gradient-to-r from-blue-50 to-indigo-50">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
          <h2 className="text-2xl font-bold text-gray-900">טבלת משימות</h2>
        </div>
      </div>


      <TasksTable  title="ניהול משימות " />
    </div>
    </>
  );
}