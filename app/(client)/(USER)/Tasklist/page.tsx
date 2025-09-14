"use client"

import React from 'react'
import Tasks from '@/app/(mini_components)/(tasks)/Tasks'

function Taskslist() {
  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' dir='rtl'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='space-y-8'>
                <Tasks />
            </div>
        </div>
    </div>
  )
}

export default Taskslist