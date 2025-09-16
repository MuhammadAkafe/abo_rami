"use client"

import React from 'react'
import TasksTable from '@/app/(client)/(ADMIN)/(tasks)/TasksTable'
import ControlPanel from '@/app/(mini_components)/controlpanel'
function Taskslist() 
{
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' dir='rtl'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='space-y-8'>
              <ControlPanel />
                <TasksTable />
            </div>
        </div>
    </div>
  )
}

export default Taskslist