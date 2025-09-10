import Link from "next/link";
import ControlPanel from "./controlpanel";
import Tasksfilter from "@/app/(components)/(mini_components)/Tasksfilter";
import { Priority, Status, tasks } from "@/generated/prisma/client";
export default function Dashboard() {
  // Mock data for demonstration
  const user = {
    firstName: "אבו",
    lastName: "ראמי",
    email: "abu.rami@example.com",
    phone: "+972501234567",
    role: "ADMIN"
  };

  const tasks: Partial<tasks>[] = [  
    {
      id: 1,
      address: "רחוב הרצל 123",
      description: "תיקון החלון השבור",
      priority: Priority.HIGH,
      status: Status.PENDING,
      userId: 1
    },
    {
      id: 2,
      address: "שדרות בן גוריון 456",
      description: "התקנת ידית דלת חדשה",
      priority: Priority.MEDIUM,
      status: Status.COMPLETED,
      userId: 1
    }
  ];



  return (
    <div className="min-h-screen bg-gray-50" dir="rtl">
      {/* Header */}
      <ControlPanel user={user} />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* User Profile Card */}
        <div className="bg-white rounded-lg shadow-sm p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">מידע אישי</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">שם פרטי</label>
              <p className="mt-1 text-sm text-gray-900">{user.firstName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">שם משפחה</label>
              <p className="mt-1 text-sm text-gray-900">{user.lastName}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">אימייל</label>
              <p className="mt-1 text-sm text-gray-900">{user.email}</p>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">טלפון</label>
              <p className="mt-1 text-sm text-gray-900">{user.phone}</p>
            </div>
          </div>
        </div>

        <Tasksfilter tasks={tasks} />
      </div>
    </div>
  );
}
