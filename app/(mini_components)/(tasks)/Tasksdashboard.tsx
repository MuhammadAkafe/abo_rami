"use client"
import React, { useState } from 'react';
import { tasks } from '@/generated/prisma/client';
import Fillter from '../Fillter';
import Tasks from './Tasks';
import TasksStatus from './TasksStatus';

export default function TasksDashbaordDisplay() {
  const [tasks, setTasks] = useState<Partial<tasks>[]|null>(null);
  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
      {/* Main Content Layout */}
      <div className="space-y-8">
        {/* Statistics Cards */}
        <div className="w-full">
          <TasksStatus tasks={tasks|| null} />
        </div>

        {/* Filter Section */}
        <div className="w-full">
          <Fillter />
        </div>

        {/* Tasks Section */}
        <div className="w-full">
          <Tasks tasks={tasks|| null} />
        </div>
      </div>
    </div>
  )
}


