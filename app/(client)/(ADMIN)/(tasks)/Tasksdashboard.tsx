"use client"
import React from 'react';
import TasksTable from './TasksTable';
import { useSession } from 'next-auth/react';
import { useGetAllTasks } from '@/app/hooks/useGetAllTasks';


export default function TasksDashbaordDisplay() {
  const { data: session } = useSession();
  const User_id = session?.user?.id;
  const { data :Tasks,isLoading:isLoadingTasks,error } = useGetAllTasks(User_id as number);


  return (
    <div className="bg-white rounded-xl shadow-lg border border-gray-100 p-8 hover:shadow-xl transition-shadow duration-300">
          <TasksTable  />
    </div>
  )
}


