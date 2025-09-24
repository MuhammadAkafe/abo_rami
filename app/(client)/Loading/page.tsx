"use client";

import LoadingComponent from "@/app/components/LoadingCompoenent";

export default function Loading() {

  return ( 
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4 sm:px-6 lg:px-8">
      <div className="w-full max-w-md">
        <LoadingComponent isLoading={true} message="טוען נתונים" />
      </div>
    </div>
  );
}
