"use client"

import React from 'react'
import { signOut } from 'next-auth/react'
import TasksTable from '@/app/(mini_components)/(tasks)/TasksTable'

function Taskslist() 
{
  const handleLogout = async () => {
    try{
    await signOut({ callbackUrl: '/Login' })
  }
  catch (error) {
    console.error('Logout failed:', error)
  }
  }

  return (
    <div className='min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100' dir='rtl'>
        <div className='max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8'>
            <div className='space-y-8'>
              {/* Header with logout button */}
              <div className='flex justify-end items-center'>
                <button
                  onClick={handleLogout}
                  className='bg-red-600 hover:bg-red-700 text-white px-6 py-2 rounded-lg font-medium transition-colors duration-200 flex items-center gap-2'
                >
                  <svg className='w-5 h-5' fill='none' stroke='currentColor' viewBox='0 0 24 24'>
                    <path strokeLinecap='round' strokeLinejoin='round' strokeWidth={2} d='M17 16l4-4m0 0l-4-4m4 4H7m6 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h4a3 3 0 013 3v1' />
                  </svg>
                 התנתק
                </button>
              </div>
              
                <TasksTable />
            </div>
        </div>
    </div>
  )
}

export default Taskslist